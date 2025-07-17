/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The ID of the city to subscribe to',
    example: 1,
    required: true,
  })
  @IsInt({ message: 'City ID must be an integer' })
  @IsNotEmpty({ message: 'City ID cannot be empty' })
  @Min(1, { message: 'City ID must be a positive integer' })
  @Type(() => Number)
  cityId: number;
}
