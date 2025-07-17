/* eslint-disable prettier/prettier */
import { Body, Controller, Post , HttpCode ,HttpStatus  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags , ApiCreatedResponse } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto} from '../User APIs/dto/createuser.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Controller('auth')
@ApiTags('auth')
export class AuthController{
    constructor(private readonly authService:AuthService ){}
    @Post('login')
    @ApiOkResponse({type:AuthEntity})
    login(@Body(){email , password }: LoginDto){
        return this.authService.login(email , password);
    }
  @Post('register')
  @ApiCreatedResponse({ type: AuthEntity }) 
  @HttpCode(HttpStatus.CREATED) 
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthEntity> { 
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  @ApiOkResponse({type:AuthEntity})
  @HttpCode(HttpStatus.OK)
  async refresh(@Body()RefreshTokenDto:RefreshTokenDto):Promise<AuthEntity>{
    return this.authService.refreshtokens(RefreshTokenDto.refreshToken);
  }
}