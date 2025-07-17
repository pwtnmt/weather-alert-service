/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token provided by the server',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3ODkwNTYwMCwiZXhwIjoxNjc5NTA1NjAwfQ.signature',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
