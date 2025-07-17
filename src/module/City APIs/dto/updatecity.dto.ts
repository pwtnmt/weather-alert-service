import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional, // สำคัญมากสำหรับ Update DTO
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer'; // สำหรับแปลง Type

export class UpdateCityDto {
  @ApiProperty({
    description: 'The new name of the city (optional)',
    example: 'New York',
    required: false,
  })
  @IsString({ message: 'City name must be a string' })
  @IsNotEmpty({ message: 'City name cannot be empty' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The new unique code of the city (optional)',
    example: 10001,
    required: false,
  })
  @IsInt({ message: 'City code must be an integer' })
  @IsOptional()
  @Type(() => Number)
  code?: number;

  @ApiProperty({
    description: 'The new latitude coordinate of the city (optional)',
    example: 40.7128,
    required: false,
  })
  @IsNumber({}, { message: 'Latitude must be a number' })
  @IsLatitude({ message: 'Latitude must be a valid latitude coordinate' })
  @IsOptional()
  @Type(() => Number)
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  latitude?: number;

  @ApiProperty({
    description: 'The new longitude coordinate of the city (optional)',
    example: -74.0060,
    required: false,
  })
  @IsNumber({}, { message: 'Longitude must be a number' })
  @IsLongitude({ message: 'Longitude must be a valid longitude coordinate' })
  @IsOptional()
  @Type(() => Number)
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  longitude?: number;
}