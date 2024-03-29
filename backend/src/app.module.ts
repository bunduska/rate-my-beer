import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { User } from './models/user.model';
import { BeersService } from './beers/beers.service';
import { Beer } from './models/beer.model';
import { BeersModule } from './beers/beers.module';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { AuthorizationMiddleware } from './middlewares/authorization.middleware';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BeersModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('TYPEORM_CONNECTION'),
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        entities: [User, Beer],
        database: configService.get('TYPEORM_DATABASE'),
        synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
        logging: configService.get('TYPEORM_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_CODE'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, BeersService, UsersService],
})
export class AppModule implements NestModule {
  constructor(private usersService: UsersService) {
    this.usersService
      .checkIfWeHaveTheAdminUser()
      .then((message) => console.log(message.message));
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'savebeer', method: RequestMethod.POST },
        { path: 'beerlist', method: RequestMethod.GET },
        { path: 'deletebeer', method: RequestMethod.DELETE },
      );
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        { path: 'user/list', method: RequestMethod.GET },
        { path: 'user/update', method: RequestMethod.POST },
        { path: 'user/delete', method: RequestMethod.DELETE },
      );
  }
}
