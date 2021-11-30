import { UsersService } from './../users/users.service';
import { Module } from '@nestjs/common';
import { BeersService } from './beers.service';
import { Beer } from '../models/beer.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/models/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Beer,User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_CODE'),
        signOptions: {
          expiresIn: configService.get('JWT_SECRET_CODE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BeersService, ConfigService, UsersService],
  exports: [BeersService, TypeOrmModule],
})
export class BeersModule {}
