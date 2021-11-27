import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private helloMessage: string;

  getHello(): string {
    return this.helloMessage;
  }
}
