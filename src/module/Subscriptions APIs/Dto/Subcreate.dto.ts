/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  Min, // สำหรับตรวจสอบค่าขั้นต่ำ
} from 'class-validator';
import { Type } from 'class-transformer'; // สำหรับแปลง Type

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The ID of the city to subscribe to',
    example: 1, // ตัวอย่าง City ID
    required: true,
  })
  @IsInt({ message: 'City ID must be an integer' })
  @IsNotEmpty({ message: 'City ID cannot be empty' })
  @Min(1, { message: 'City ID must be a positive integer' }) // City ID ควรเป็นค่าบวก
  @Type(() => Number) // แปลงค่าที่เข้ามาเป็น Number เพื่อให้ IsInt ทำงานได้ถูกต้อง
  cityId: number;
}
