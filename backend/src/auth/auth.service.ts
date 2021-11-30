import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return { message: 'User does not exist!' };
    }
    if (!user.isValidated) {
      return { message: 'Please validate your e-mail!' };
    }
    const validPassword = await verify(user.password, pass);
    if (!validPassword) {
      return { message: 'Incorrect password!' };
    }
    if (validPassword && user.isValidated) {
      const payload = {
        userId: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        email: user.email,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    }
    return { message: 'Unauthorized' };
  }
}
