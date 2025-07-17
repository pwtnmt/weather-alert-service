/* eslint-disable prettier/prettier */
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateSubscriptionDto } from './Dto/Subcreate.dto';
import { Subscription } from '@prisma/client';
import { CityService } from 'src/module/City APIs/city.service'; 

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private citiesService: CityService,
  ) {}

  async create(userId: number, createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const { cityId } = createSubscriptionDto;

    try {
      await this.citiesService.findOne(cityId);
      const existingSubscription = await this.prisma.subscription.findUnique({
        where: {
          userId_cityId: {
            userId: userId,
            cityId: cityId,
          },
        },
      });

      if (existingSubscription) {
        throw new ConflictException(`User ${userId} is already subscribed to city ${cityId}.`);
      }

      
      const subscription = await this.prisma.subscription.create({
        data: {
          userId: userId,
          cityId: cityId,
        },
      });
      return subscription;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating subscription:', error);
      throw new InternalServerErrorException('Failed to create subscription.');
    }
  }

  async findAll(userId: number): Promise<Subscription[]> {
    try {
      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          userId: userId,
        },
        include: {
          City: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return subscriptions;
    } catch (error) {
      console.error(`Error finding subscriptions for user ${userId}:`, error);
      throw new InternalServerErrorException('Failed to retrieve subscriptions.');
    }
  }

  async remove(userId: number, subscriptionId: number): Promise<void> {
    try {
      const subscription = await this.prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      if (!subscription) {
        throw new NotFoundException(`Subscription with ID ${subscriptionId} not found.`);
      }

      if (subscription.userId !== userId) {
        throw new UnauthorizedException(`You are not authorized to delete this subscription.`);
      }

      await this.prisma.subscription.delete({
        where: { id: subscriptionId },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error(`Error deleting subscription ${subscriptionId} for user ${userId}:`, error);
      throw new InternalServerErrorException('Failed to delete subscription.');
    }
  }
}
