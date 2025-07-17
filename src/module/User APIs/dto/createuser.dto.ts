/* eslint-disable prettier/prettier */
import {Prisma} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength , IsEmail } from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The email address of the user',
        example: 'john.doe@example.com',
        required: true,
    })
    @IsEmail()
    email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @ApiProperty({
        description: 'The password for the user account (minimum 8 characters)',
        example: 'StrongP@ssw0rd',
        required: true,
    })
    password: string;
}