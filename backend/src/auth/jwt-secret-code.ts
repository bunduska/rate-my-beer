import { config } from 'dotenv';

export class JwtSecret {
  static getSecret(): string {
    config();
    return process.env.JWT_SECRET_CODE;
  }
}
