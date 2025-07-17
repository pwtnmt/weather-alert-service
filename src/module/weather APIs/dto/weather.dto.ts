/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({ description: 'City ID', example: 1 })
  cityId: number;

  @ApiProperty({ description: 'City name', example: 'Bangkok' })
  cityName: string;

  @ApiProperty({ description: 'Current temperature in Celsius', example: 28.5 })
  temperature: number;

  @ApiProperty({ description: 'Weather description', example: 'Clear sky' })
  description: string;

  @ApiProperty({ description: 'Humidity percentage', example: 70 })
  humidity: number;

  @ApiProperty({ description: 'Wind speed in m/s', example: 2.1 })
  windSpeed: number;

  @ApiProperty({ description: 'Timestamp of the weather data', example: '2023-07-16T12:00:00Z' })
  timestamp: Date;

  constructor(data: { cityId: number; cityName: string; temperature: number; description: string; humidity: number; windSpeed: number; timestamp: Date }) {
    Object.assign(this, data);
  }
}