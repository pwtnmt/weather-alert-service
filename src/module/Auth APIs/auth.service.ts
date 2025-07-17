/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/module/User APIs/dto/createuser.dto';
import { UsersService } from 'src/module/User APIs/user.service';
const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d'; 

const SALT_ROUNDS = 10;
@Injectable()
export class AuthService{
  constructor(private prisma: PrismaService ,private jwtService:JwtService, private usersService: UsersService){}
  private async generateTokens(userId: number): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
      token: refreshToken,
      userId: userId,
      expiresAt: expiresAt,
      revoked: false,
    },
    });
  return { accessToken , refreshToken};
  }
  async login(email: string , password : string) : Promise<AuthEntity>{
    const user = await this.prisma.user.findUnique({where:{email:email}});
    if(!user || !(await bcrypt.compare(password, user.password))){
      throw new UnauthorizedException('Invalid credentials');
    }
    const {accessToken,refreshToken} = await this.generateTokens(user.id)
    return { accessToken , refreshToken}
    }
  async register(createUserDto: CreateUserDto): Promise<AuthEntity> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    const newUser = await this.usersService.create({
      ...createUserDto, 
      password: hashedPassword,
    });
    const {accessToken,refreshToken} = await this.generateTokens(newUser.id);
    return { accessToken , refreshToken };
    }
  async refreshtokens(refreshToken:string):Promise<AuthEntity>{
    let payload:{userId:number};
    try{
      payload = this.jwtService.verify(refreshToken);
    }
    catch(error){
      throw new UnauthorizedException('invalid or expired refresh token')
    }
    const storeToken = await this.prisma.refreshToken.findUnique({
      where:{token:refreshToken},
    });
    if(!storeToken || storeToken.revoked || storeToken.expiresAt < new Date()){
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }
    if(storeToken.userId !== payload.userId){
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }
    await this.prisma.refreshToken.update({
      where:{id: storeToken.id},
      data:{revoked:true}
    })
    const {accessToken, refreshToken:newRefreshToken} = await this.generateTokens(payload.userId);
    return { accessToken , refreshToken : newRefreshToken}
  }

}