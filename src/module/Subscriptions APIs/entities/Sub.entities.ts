    /* eslint-disable prettier/prettier */
    import { Subscription, User, City } from '@prisma/client';
    import { ApiProperty } from '@nestjs/swagger';
    import { UserEntity } from 'src/module/User APIs/entity/user.entity'; 
    import { CityEntity } from 'src/module/City APIs/entity/city.entity'; 

    export class SubscriptionEntity implements Subscription {
      @ApiProperty({ description: 'Unique identifier of the subscription', example: 1 })
      id: number;

      @ApiProperty({ description: 'ID of the user who made the subscription', example: 101 })
      userId: number;

      @ApiProperty({ description: 'ID of the city subscribed to', example: 201 })
      cityId: number;

      @ApiProperty({ description: 'Date and time when the subscription was created', example: '2023-01-01T10:00:00.000Z' })
      createdAt: Date;

      @ApiProperty({ description: 'Date and time when the subscription was last updated', example: '2023-01-01T10:00:00.000Z' })
      updatedAt: Date;

      // @ApiProperty({ type: () => UserEntity, description: 'User who made the subscription' })
      // user?: UserEntity;

      // @ApiProperty({ type: () => CityEntity, description: 'City that was subscribed to' })
      // city?: CityEntity;

      constructor(partial: Subscription) {
        Object.assign(this, partial);
      }
    }
    