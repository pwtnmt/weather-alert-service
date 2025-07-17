/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/module/User APIs/user.service'
import { UserEntity } from 'src/module/User APIs/entity/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy (Strategy , 'jwt'){
    constructor (private configService: ConfigService , private userService:UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }
    async validate(payload : {userId : number}):Promise<UserEntity>{
        console.log('--- JwtStrategy.validate ---'); 
        console.log('JWT Payload received:', payload);
        try{
            const user = await this.userService.findOne(payload.userId);
            console.log('User found by userService.findOne:', user); 
            if(!user){
                console.error('User not found or invalid token during validation.'); 
                throw new UnauthorizedException('User not found or invalid token');
            }
            
            return new UserEntity(user);
        }
        catch(error){
            console.error('Error during JWT validation:', error.message); 
            throw new UnauthorizedException('invalid token or user validation failed')
        }
    }
}
