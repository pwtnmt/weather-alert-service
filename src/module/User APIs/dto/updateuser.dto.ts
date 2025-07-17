/* eslint-disable prettier/prettier */
import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';


export class UpdateUserDto implements Prisma.UserUpdateInput {
  @ApiProperty({
    description: 'The new email address of the user (optional)',
    example: 'new.email@example.com',
  })
  @IsString()
  @IsEmail()  
  @IsOptional()
  email?: string; 

  @ApiProperty({
    description: 'The new password for the user account (minimum 8 characters, optional)',
    example: 'NewStrongP@ssw0rd',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsOptional() 
  password?: string;
}
