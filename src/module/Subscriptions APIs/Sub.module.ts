/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubscriptionsService } from './Sub.service';
import { SubscriptionsController } from './Sub.controller';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { CityModule } from 'src/module/City APIs/city.module'; 
import { PassportModule } from '@nestjs/passport'; 

@Module({
  imports: [
    PrismaModule,
    CityModule,
    PassportModule,
  ],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
