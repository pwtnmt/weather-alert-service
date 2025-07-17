/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; 
import { ConfigService } from '@nestjs/config'; 
import { firstValueFrom } from 'rxjs'; 
import { WeatherResponseDto } from './dto/weather.dto';
import { CityService } from 'src/module/City APIs/city.service'; 


interface WeatherCacheEntry {
  data: WeatherResponseDto;
  timestamp: number; 
}

@Injectable()
export class WeatherService {
  private readonly WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1/current.json'; 
  private readonly API_KEY: string; 
  private readonly CACHE_DURATION_MS = 10 * 60 * 1000; 

  
  private weatherCache = new Map<number, WeatherCacheEntry>(); 

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly citiesService: CityService, 
  ) {
    
    const apiKey = this.configService.get<string>('WEATHERAPI_API_KEY'); 
    if (!apiKey) {
      
      throw new InternalServerErrorException('WEATHERAPI_API_KEY is not set in environment variables. Please configure it.');
    }
    this.API_KEY = apiKey; 
  }


  async getWeather(cityId: number): Promise<WeatherResponseDto> {
    
    const cachedData = this.weatherCache.get(cityId);
    if (cachedData && (Date.now() - cachedData.timestamp < this.CACHE_DURATION_MS)) {
      console.log(`Serving weather data for city ${cityId} from cache.`);
      return cachedData.data;
    }

    
    let city;
    try {
      city = await this.citiesService.findOne(cityId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`City with ID ${cityId} not found.`);
      }
      console.error(`Error finding city ${cityId}:`, error);
      throw new InternalServerErrorException('Failed to retrieve city information.');
    }

   
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.WEATHER_API_BASE_URL, {
          params: {
            key: this.API_KEY, 
            q: `${city.latitude},${city.longitude}`, 
            aqi: 'no', 
            lang: 'th', 
          },
        }),
      );

      const weatherData = response.data;

      
      const formattedWeather: WeatherResponseDto = new WeatherResponseDto({
        cityId: city.id,
        cityName: weatherData.location.name, 
        temperature: weatherData.current.temp_c, 
        description: weatherData.current.condition.text, 
        humidity: weatherData.current.humidity, 
        windSpeed: weatherData.current.wind_kph / 3.6, 
        timestamp: new Date(weatherData.current.last_updated_epoch * 1000),
      });

      
      this.weatherCache.set(cityId, {
        data: formattedWeather,
        timestamp: Date.now(),
      });
      console.log(`Fetched and cached weather data for city ${cityId}.`);

      return formattedWeather;
    } catch (error) {
      console.error(`Error fetching weather for city ${cityId}:`, error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to retrieve weather data from external API.');
    }
  }
}