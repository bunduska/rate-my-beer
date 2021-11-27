import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      email: 'bebasz@yahoo.com',
      type: 'user',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      email: 'bebasz@yahoo.com',
      type: 'user',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
