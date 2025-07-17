/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/Auth APIs/auth.module';
import { UsersModule } from './module/User APIs/user.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { CityModule } from './module/City APIs/city.module';
import { SubscriptionsModule } from './module/Subscriptions APIs/Sub.module';
import { WeatherModule } from './module/weather APIs/weather.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // <--- เพิ่ม import ThrottlerModule และ ThrottlerGuard
import { APP_GUARD } from '@nestjs/core'; // <--- เพิ่ม import APP_GUARD

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CityModule,
    SubscriptionsModule,
    WeatherModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}