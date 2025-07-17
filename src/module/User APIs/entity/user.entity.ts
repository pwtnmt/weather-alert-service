/* eslint-disable prettier/prettier */
import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements Omit<User,'password'> {
  @ApiProperty({ description: 'Unique identifier of the user', example: 1 })
  id: number;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'Date and time when the user was created', example: '2023-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the user was last updated', example: '2023-01-01T10:00:00.000Z' })
  updatedAt: Date;
  constructor(partial:Omit<User,'password'>){
    Object.assign(this, partial);
  }
}
