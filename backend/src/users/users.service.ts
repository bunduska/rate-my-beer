import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';
import { ConfigService } from 'src/config/config.service';
import { environment } from '../environments/environment';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { createTransport } from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async register(userToRegister : User)
  : Promise<User | { message: string }> {
    if ((await this.findUserByEmail(userToRegister.email)) !== undefined) {
      return { message: 'Email is already taken!' };
    }
    userToRegister.password = await hash(userToRegister.password);
    await this.sendRegistrationValidator(userToRegister);

    try {
      return await this.usersRepository.save(userToRegister);
    } catch {
      return { message: 'Error when saving user!!!' };
    }
  }

  async sendRegistrationValidator(user: User): Promise<void> {
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    const transporter = createTransport({
      host: this.configService.get('EMAIL_SMTP_HOST'),
      port: this.configService.get('EMAIL_SMTP_PORT'),
      auth: {
        user: this.configService.get('EMAIL_ADDRESS'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    const message = {
      from: `Rate My Beer App <${this.configService.get('EMAIL_ADDRESS')}>`,
      to: user.email,
      subject: 'Thanks for your registration to the Rate My Beer App',
      html: `Thanks for registering!
      Please click to this <a href="${environment.api_url}/user/validation?token=${token}">link</a> to verify your email address.
     `,
    };
    try {
      await transporter.sendMail(message);
    } catch (err) {
      console.error(err);
    }
  }

  async validateRegistration(token: string): Promise<boolean> {
    const userToValidate: User = await this.jwtService.verify(token);
    const user: User = await this.findUserByEmail(userToValidate.email);
    console.log(user);
    if (user) {
      user.isValidated = true;
      try {
        await this.usersRepository.save(user);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}
