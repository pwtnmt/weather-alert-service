/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,

} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiResponse, ApiTags , ApiNoContentResponse } from '@nestjs/swagger';
import { CityService } from './city.service';
import { CityEntity } from './entity/city.entity';
import { CreateCityDto } from './dto/createcity.dto';
import { UpdateCityDto } from './dto/updatecity.dto';

@Controller('cities')
@ApiTags('cities')
export class CityController{
    constructor(private readonly cityservice:CityService){}

    @Post()
    @ApiCreatedResponse({type:CityEntity})
    @HttpCode(HttpStatus.CREATED)
    async create(@Body()createCityDto:CreateCityDto):Promise<CityEntity>{
        console.log('Creating city with data:', createCityDto);
        const city = await this.cityservice.create(createCityDto);
        return new CityEntity(city);
    }

    @Get()
    @ApiOkResponse({ type: CityEntity, isArray: true })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ): Promise<CityEntity[]> { 
        console.log(`Controller findAll called with page: ${page}, limit: ${limit}`); 
        const { data: citiesData, total, page: currentPage, totalPages } = await this.cityservice.findAll(page, limit);
        
        console.log('Data from service (citiesData array):', citiesData); 
        console.log('Total from service:', total); 

        return citiesData.map((city) => new CityEntity(city));
    }

    @Get(':id')
    @ApiOkResponse({type:CityEntity,})
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id',ParseIntPipe)id:number):Promise<CityEntity>{
        console.log('Finding city by ID:', id); 
        const city = await this.cityservice.findOne(id)
        return new CityEntity(city);
    }

    @Patch(':id')
    @ApiResponse({type:CityEntity})
    async update(
        @Param('id',ParseIntPipe)id:number,
        @Body()updateCityDto:UpdateCityDto,
    ):Promise<CityEntity>{
        console.log(`Updating city ${id} with data:`, updateCityDto);
        const updatecity = await this.cityservice.update(id,updateCityDto);
        return new CityEntity(updatecity);
    }

    @Delete(':id')
    @ApiNoContentResponse({ description: 'City successfully deleted' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id',ParseIntPipe)id:number):Promise<void>{
        console.log('Removing city by ID:', id);
        await this.cityservice.remove(id);
    }
}
