/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule,} from '@nestjs/config';
import { CityModule } from 'src/module/City APIs/city.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule, 
    CityModule, 
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
