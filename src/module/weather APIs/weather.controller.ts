/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from './dto/weather.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth, 
} from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('weather')
@ApiTags('weather')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}


  @Get(':cityId')
  @ApiOkResponse({ type: WeatherResponseDto, description: 'Current weather data for the specified city.' })
  @HttpCode(HttpStatus.OK)
  async getWeather(@Param('cityId', ParseIntPipe) cityId: number): Promise<WeatherResponseDto> {
    return this.weatherService.getWeather(cityId);
  }
}
