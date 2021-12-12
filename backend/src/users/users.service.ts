import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import { ConfigService } from '../config/config.service';
import { environment } from '../environments/environment';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { createTransport } from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async register(userToRegister: User): Promise<User | { message: string }> {
    if (
      userToRegister.username === undefined ||
      userToRegister.username === ''
    ) {
      return { message: 'Missing username field!' };
    }
    if (userToRegister.email === undefined || userToRegister.email === '') {
      return { message: 'Missing email field!' };
    }
    if (
      userToRegister.password === undefined ||
      userToRegister.password === ''
    ) {
      return { message: 'Missing password field!' };
    }

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
      Please click to this <a href="${environment.api_url}user/validation?token=${token}">link</a> to verify your email address.
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

  async checkIfWeHaveTheAdminUser(): Promise<{ message: string }> {
    if (
      await this.usersRepository.findOne({
        where: { isAdmin: true, email: 'admin@admin.admin' },
      })
    ) {
      return { message: 'We have already the Admin user.' };
    } else {
      const adminUser = new User(
        'Admin',
        'admin@admin.admin',
        await hash('adminadmin'),
      );
      adminUser.isAdmin = true;
      adminUser.isValidated = true;
      try {
        await this.usersRepository.save(adminUser);
        return { message: 'Admin user created.' };
      } catch {
        return { message: 'Error when saving the Admin user!!!' };
      }
    }
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findAllUsersExceptTheCurrentOne(currentUser: number): Promise<User[]> {
    return (await this.usersRepository.find()).filter(
      (user) => user.id !== currentUser,
    );
  }

  async saveUser(userToSave: User): Promise<{ message: string }> {
    try {
      await this.usersRepository.save(userToSave);
      return {
        message: `User entry succesfully saved (id ${userToSave.id}).`,
      };
    } catch {
      return { message: 'Error when saving user record!!!' };
    }
  }

  async deleteUser(userToDelete: User): Promise<{ message: string }> {
    try {
      await this.usersRepository.delete(userToDelete.id);
      return {
        message: `User was deleted.`,
      };
    } catch {
      return { message: 'Error when deleting user record!!!' };
    }
  }
}
