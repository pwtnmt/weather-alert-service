/* eslint-disable prettier/prettier */
import { ApiProperty} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'The email address for login',
        example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsString({ message: 'Email must be a string' })
    email: string;

    @ApiProperty({
        description: 'The password for login',
        example: 'yourpassword',
    })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password:string;
}