import { ConfigService } from './../config/config.service';
import { ConfigModule } from './../config/config.module';
import { User } from './../models/user.model';
import { UsersService } from './../users/users.service';
import { Module } from '@nestjs/common';
import { BeersService } from './beers.service';
import { Beer } from '../models/beer.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Beer, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_CODE'),
        signOptions: {
          expiresIn: configService.get('JWT_TOKEN_EXPIRY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BeersService, ConfigService, UsersService],
  exports: [BeersService, TypeOrmModule],
})
export class BeersModule {}
