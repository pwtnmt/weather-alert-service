// /* eslint-disable prettier/prettier */
// import { Prisma } from '@prisma/client';
// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsEmail,
//   IsNotEmpty,
//   IsString,
//   MinLength,
//   IsOptional,
//   Matches, 
// } from 'class-validator';

// export class RegisterDto implements Prisma.UserCreateInput {
//   @ApiProperty({
//     description: 'The email address of the user',
//     example: 'john.doe@example.com',
//     required: true,
//   })
//   @IsString()
//   @IsNotEmpty()
//   @IsEmail()
//   email: string;

//   @ApiProperty({
//     description: 'The password for the user account (minimum 8 characters, with complexity)',
//     example: 'StrongP@ssw0rd1',
//     required: true,
//   })
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(8, { message: 'Password must be at least 8 characters long' })
//   // ตัวอย่างการเพิ่มความซับซ้อนของรหัสผ่าน:
// //   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
// //     message: 'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
// //   })
//   password: string;

//   @ApiProperty({
//     description: 'Confirm password for registration',
//     example: 'StrongP@ssw0rd1',
//     required: true,
//   })
//   @IsString()
//   @IsNotEmpty()
//   @ValidateIf((o) => o.password)
//   @IsEqualTo('password', { message: 'Passwords do not match' })
//   confirmPassword: string; // ฟิลด์นี้จะไม่ถูกส่งไป DB

// //   @ApiProperty({
// //     description: 'The full name of the user',
// //     example: 'John Doe',
// //     required: true,
// //   })
// //   @IsString()
// //   @IsNotEmpty()
// //   name: string;

// //   @ApiProperty({
// //     description: 'The telephone number of the user (optional)',
// //     example: '0812345678',
// //     required: false,
// //   })
// //   @IsString()
// //   @IsOptional()
// //   tel?: string;
// }