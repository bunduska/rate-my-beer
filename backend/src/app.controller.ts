import { Controller, Request, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  async login(@Request() req) {
    const userToLogin: { email: string; password: string } = req.body;
    return this.authService.login(userToLogin.email, userToLogin.password);
  }

  @Post('/register')
  async register(@Request() req) {
    const newUser: {
      email: string;
      password: string;
      username: string;
    } = req.body;
    try { 
      return this.usersService.register(
        newUser.email,
        newUser.password,
        newUser.username,
      );
    } catch {
      return { message: "Error when saving user!!!"}
    }
    
  }
}
