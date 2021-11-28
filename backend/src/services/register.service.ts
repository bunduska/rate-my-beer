import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterService {

  register(email: string, password: string, username: string): string {
    console.log('registration attempt');
    return null;
  }
}
