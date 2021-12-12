import { ConfigModule } from './../config/config.module';
import { ConfigService } from './../config/config.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
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

  providers: [AuthService, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
