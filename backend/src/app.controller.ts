import { BeersService } from './beers/beers.service';
import {
  Controller,
  Request,
  Post,
  Get,
  Query,
  Response,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { environment } from './environments/environment';
import { Beer } from './models/beer.model';
import { User } from './models/user.model';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private beersService: BeersService,
  ) {}

  @Get()
  homepage() {
    return `Rate Beer App's backend database greets you!`;
  }

  @Post('/login')
  async login(@Request() req) {
    const userToLogin: { email: string; password: string } = req.body;
    return this.authService.login(userToLogin.email, userToLogin.password);
  }

  @Post('/register')
  async register(@Request() req) {
    const newUser: User = req.body;
    return this.usersService.register(newUser);
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

  @Post('/savebeer')
  async savebeer(@Request() req) {
    const beer: Beer = req.body;
    const userId: number = req.body.userId;
    return this.beersService.saveBeer(beer, userId);
  }

  @Get('/beerlist')
  async beerlist(@Request() req) {
    const userId: number = req.body.userId;
    return this.beersService.getBeerList(userId);
  }

  @Delete('/deletebeer')
  async deletebeer(@Request() req) {
    const beer: Beer = req.body;
    return this.beersService.deleteBeer(beer);
  }

  @Post('/user/update')
  async saveUser(@Request() req) {
    const user: User = req.body;
    return this.usersService.saveUser(user);
  }

  @Get('/user/list')
  async userlist(@Request() req) {
    const userId: number = req.body.userId;
    return this.usersService.findAllUsersExceptTheCurrentOne(userId);
  }

  @Delete('/user/delete')
  async deleteuser(@Request() req) {
    const user: User = req.body;
    return this.usersService.deleteUser(user);
  }
}
