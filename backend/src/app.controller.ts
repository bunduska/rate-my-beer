import { Controller, Request, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { RegisterService } from './services/register.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService, private registerService: RegisterService) {}

  @Post('/login')
  async login(@Request() req) {
    const userToLogin: { email: string; password: string } = req.body;
    return this.authService.login(userToLogin.email, userToLogin.password);
  }

  @Post('/register')
  async register(@Request() req) {
    const userToRegister: { email: string; password: string; username: string } = req.body;
    return this.registerService.register(userToRegister.email, userToRegister.password, userToRegister.username);
  }

}
