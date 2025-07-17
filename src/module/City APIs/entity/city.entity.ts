    /* eslint-disable prettier/prettier */
    import { City } from '@prisma/client';
    import { ApiProperty } from '@nestjs/swagger';

    export class CityEntity implements City {
      @ApiProperty({ description: 'Unique identifier of the city', example: 1 })
      id: number;

      @ApiProperty({ description: 'Name of the city', example: 'Bangkok' })
      name: string;

      @ApiProperty({ description: 'Unique code of the city', example: 10100 })
      code: number;

      @ApiProperty({ description: 'Latitude coordinate of the city', example: 13.7563 })
      latitude: number;

      @ApiProperty({ description: 'Longitude coordinate of the city', example: 100.5018 })
      longitude: number;

      @ApiProperty({ description: 'Date and time when the city was created', example: '2023-01-01T10:00:00.000Z' })
      createdAt: Date;

      @ApiProperty({ description: 'Date and time when the city was last updated', example: '2023-01-01T10:00:00.000Z' })
      updatedAt: Date;

      constructor(partial: City) {
        Object.assign(this, partial);
      }
    }
    