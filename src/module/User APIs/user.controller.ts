/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UnauthorizedException,

} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/createuser.dto';
import { UpdateUserDto } from './dto/updateuser.dto';
import { ApiBearerAuth,ApiCreatedResponse, ApiOkResponse, ApiTags , ApiQuery } from '@nestjs/swagger';
import { UserEntity } from './entity/user.entity';
import { JwtAuthGuard } from 'src/module/Auth APIs/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @ApiCreatedResponse({ type: UserEntity })
  // async create(@Body() createUserDto: CreateUserDto):Promise<UserEntity> {
  //   const user = await this.usersService.create(createUserDto);
  //   return new UserEntity(user);
  // }

@Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // แก้ไข ApiOkResponse ให้ถูกต้องตาม Return Type ใหม่
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/UserEntity' } },
        total: { type: 'number' },
        page: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<{ data: UserEntity[]; total: number; page: number; totalPages: number }> { 
    
    const { data, total, page: currentPage, totalPages } = await this.usersService.findAll(page, limit);

    return {
      data: data.map((user) => new UserEntity(user)),
      total,
      page: currentPage,
      totalPages,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity,})
  async getProfile(@Req()req:any):Promise<UserEntity>{
    const userId = req.user.id;
    const user = await this.usersService.findOne(userId);
   if (!user) {
      throw new UnauthorizedException('User profile not found'); 
    }

    return new UserEntity(user);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number):Promise<UserEntity> {
    const user = await this.usersService.findOne(id)
    return new UserEntity(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ):Promise<UserEntity> {
    const updateUser = await this.usersService.update(id,updateUserDto);
    return new UserEntity(updateUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number):Promise<UserEntity> {
    const deletedUser = await this.usersService.remove(id);
    return new UserEntity(deletedUser);
  }
}