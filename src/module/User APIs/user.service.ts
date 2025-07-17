/* eslint-disable prettier/prettier */
import { Injectable ,NotFoundException,ConflictException , InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/createuser.dto';
import { UpdateUserDto } from './dto/updateuser.dto';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10 ; 


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto):Promise<Omit<User,'password'>> {
    try{
      const existuser = await this.prisma.user.findUnique({where :{email:createUserDto.email}})
      if(existuser){
        throw new ConflictException('Email already exists');
      }
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true, 
        },
      });
      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating user in UsersService:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  async findAll(page?: number, limit?: number): Promise<{ data: Omit<User, 'password'>[]; total: number; page: number; totalPages: number }> { // <--- แก้ไข: ใช้ User (ตัว U ใหญ่)
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: skip,
        take: take,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = limit ? Math.ceil(total / limit) : 1;

    return {
      data,
      total,
      page: page || 1,
      totalPages,
    };
  }

  async findOne(id: number):Promise<Omit<User,'password'>> {
    const user = await this.prisma.user.findUnique({
      where:{id},
      select : {
        id :true,
        email : true,
        createdAt: true,
        updatedAt : true,
      },
    });
    if(!user){
      throw new NotFoundException(`User with ID ${id} not found `);
    }
    return user;
  }
    async findbyEmail(email:string):Promise<Omit<User,'password'>> {
    const user = await this.prisma.user.findUnique({
      where:{email},
      select : {
        id :true,
        email : true,
        createdAt: true,
        updatedAt : true,
      },
    });
    if(!user){
      throw new NotFoundException(`User with email ${email} not found `);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto):Promise<Omit<User,'password'>> {
    try{
      const existuser = await this.prisma.user.findUnique({where:{id}});
      if(!existuser){
        throw new NotFoundException(`User with ID ${id} not found `) 
      }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        SALT_ROUNDS
      );
    }
    if(updateUserDto.email && updateUserDto.email !== existuser.email){
      const emailexits = await this.prisma.user.findUnique({
        where:{email:updateUserDto.email},
      });
      if(emailexits&&emailexits.id !== id ){
        throw new ConflictException('Email already in use by another user')
      }
    }
    const updateUser = await this.prisma.user.update({
      where:{id},
      data : updateUserDto,
      select:{
        id: true,
        email:true,
        createdAt:true,
        updatedAt:true,
      },
    });
    return updateUser
  }
  catch(error){
    if(error instanceof NotFoundException || error instanceof ConflictException){
      throw error ; 
    }
    console.error(`Error updating user with ID ${id}`,error);
    throw new InternalServerErrorException('failed to update user'); 
  }
  }

  async remove(id: number):Promise<Omit<User,'password'>> { 
    try{
      const existuser = await this.prisma.user.findUnique({where:{id},});
      if(!existuser){
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const deletedUser = await this.prisma.user.delete({
        where:{id},
        select:{
          id: true,
          email: true,
          createdAt:true,
          updatedAt:true,
        }
      })
      return deletedUser;
    }
    catch(error){
      if(error instanceof NotFoundException ){
        throw error ;
      }
      console.error(`Error deleted user with ID ${id}`,error);
      throw new InternalServerErrorException('Failed to deleted user');
    }
  }
}