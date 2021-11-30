import { ConfigService } from './../config/config.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

const PREFIX = 'Bearer';
type JWTPayload = {
  userId: number;
  isAdmin: boolean;
  exp: number;
};

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const headerAuthorization: string = req.headers.authorization;
    try {
      if (
        !headerAuthorization ||
        headerAuthorization.split(' ')[0] !== PREFIX ||
        headerAuthorization.split(' ').length !== 2
      )
        throw new Error();

      const token: string = headerAuthorization.split(' ')[1];

      const decoded: JWTPayload = this.jwtService.verify(
        token,
        this.configService.get('JWT_SECRET_CODE'),
      );
      req.body.userId = decoded.userId;
      req.body.isAdmin = decoded.isAdmin;
      next();
    } catch {
      res.status(401).json({
        message: 'Invalid token',
      });
    }
  }
}
