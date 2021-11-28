import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const userToRegister: User = new User();
    userToRegister.email = email;
    userToRegister.password = password;
    userToRegister.username = username;
    return await this.usersRepository.save(userToRegister);
  }
}
