import {
  Controller,
  Request,
  Post,
  Get,
  Query,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { environment } from './environments/environment';

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
    return this.usersService.register(
      newUser.email,
      newUser.password,
      newUser.username,
    );
  }

  @Get('/user/validation')
  async validate(@Query() query, @Response() res) {
    const queryToValidate: { token: string } = query;
    if (typeof queryToValidate.token === 'string') {
      const isValidated: boolean = await this.usersService.validateRegistration(
        queryToValidate.token,
      );
      if (isValidated) {
        return res.redirect(`${environment.api_url_frontend}/login`);
      } else {
        return res.redirect(`${environment.api_url_frontend}/register`);
      }
    }
    return res.redirect(`${environment.api_url_frontend}/register`);
  }
}
