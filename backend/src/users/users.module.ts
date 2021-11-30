import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  providers: [UsersService, ConfigService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
