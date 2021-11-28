import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && user.password === pass) {
      const payload = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        email: user.email,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    }
    if (!user) {
      return { message: 'User does not exist!'};
    } else if (user.password !== pass) {
      return { message: 'Incorrect password!'};
    } else {
      return { message: 'Unauthorized'};
    }
  }
}
