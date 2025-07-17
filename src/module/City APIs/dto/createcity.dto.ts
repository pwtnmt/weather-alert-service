/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsLatitude, 
  IsLongitude,
  Min,
  Max 
} from 'class-validator';
import { Type } from 'class-transformer'; 

export class CreateCityDto {
  @ApiProperty({
    description: 'The name of the city',
    example: 'Bangkok',
    required: true,
  })
  @IsString({ message: 'City name must be a string' })
  @IsNotEmpty({ message: 'City name cannot be empty' })
  name: string;

  @ApiProperty({
    description: 'The unique code of the city (e.g., postal code, city ID)',
    example: 10100,
    required: true,
  })
  @IsInt({ message: 'City code must be an integer' })
  @IsNotEmpty({ message: 'City code cannot be empty' })
  @Type(() => Number)
  code: number;

  @ApiProperty({
    description: 'The latitude coordinate of the city',
    example: 13.7563,
    required: true,
  })
  @IsNumber({}, { message: 'Latitude must be a number' })
  @IsNotEmpty({ message: 'Latitude cannot be empty' })
  @IsLatitude({ message: 'Latitude must be a valid latitude coordinate' })
  @Type(() => Number) 
   @Min(-90, { message: 'Latitude must be between -90 and 90' })
   @Max(90, { message: 'Latitude must be between -90 and 90' })   
  latitude: number;

  @ApiProperty({
    description: 'The longitude coordinate of the city',
    example: 100.5018,
    required: true,
  })
  @IsNumber({}, { message: 'Longitude must be a number' })
  @IsNotEmpty({ message: 'Longitude cannot be empty' })
  @IsLongitude({ message: 'Longitude must be a valid longitude coordinate' })
  @Type(() => Number)
   @Min(-180, { message: 'Longitude must be between -180 and 180' }) 
   @Max(180, { message: 'Longitude must be between -180 and 180' })
  longitude: number;
}