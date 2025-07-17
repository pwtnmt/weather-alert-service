/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request as Req, 
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { SubscriptionsService } from './Sub.service';
import { CreateSubscriptionDto } from './Dto/Subcreate.dto';
import { SubscriptionEntity } from './entities/Sub.entities';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBearerAuth, 
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/module/Auth APIs/jwt-auth.guard';

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiCreatedResponse({ type: SubscriptionEntity, description: 'Subscription created successfully.' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: any,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
        console.log('--- SubscriptionsController.create ---');
        console.log('Received Request Body:', createSubscriptionDto); 
        console.log('req.user from JWT Guard:', req.user); 
        const userId = req.user.id;
        console.log('Extracted userId:', userId);
        const subscription = await this.subscriptionsService.create(userId, createSubscriptionDto);
        return new SubscriptionEntity(subscription);
    }

  @Get()
  @ApiOkResponse({ type: SubscriptionEntity, isArray: true, description: 'List of subscribed cities for the user.' })
  async findAll(@Req() req: any): Promise<SubscriptionEntity[]> {
    console.log('--- SubscriptionsController.findAll ---'); 
    console.log('req.user from JWT Guard:', req.user);
    const userId = req.user.id;
    console.log('Extracted userId:', userId);
    if (!userId) {
      console.error('UserId is undefined after JWT Guard. Token might be invalid or strategy is not populating user correctly.');
      throw new UnauthorizedException('User ID not found in token payload.');
    }
    const subscriptions = await this.subscriptionsService.findAll(userId);
    return subscriptions.map(sub => new SubscriptionEntity(sub));
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Subscription successfully deleted.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: any,
    @Param('id', ParseIntPipe) subscriptionId: number,
  ): Promise<void> {
        console.log('--- SubscriptionsController.remove ---');
        console.log('req.user from JWT Guard:', req.user);
        const userId = req.user.id;
        console.log('Extracted userId:', userId);
        if (!userId) {
            console.error('UserId is undefined after JWT Guard. Token might be invalid or strategy is not populating user correctly.');
            throw new UnauthorizedException('User ID not found in token payload.');
        }
        await this.subscriptionsService.remove(userId, subscriptionId);
    }
}