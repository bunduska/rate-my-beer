import { JwtService } from '@nestjs/jwt';
import { ConfigService } from './../config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/user.model';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: () => {
              return Promise.resolve([
                1,
                'Vagyok',
                'password',
                'marvan@email.com',
                0,
                1,
              ]);
            },
            save: () => {
              jest.fn();
            },
            delete: () => {
              jest.fn();
            },
          },
        },
        ConfigService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds an existing user by id', async () => {
    const res = await service.findUserById(1);
    expect(res).toEqual([1, 'Vagyok', 'password', 'marvan@email.com', 0, 1]);
  });

  it('finds an existing user by email', async () => {
    const res = await service.findUserByEmail('marvan@email.com');
    expect(res).toEqual([1, 'Vagyok', 'password', 'marvan@email.com', 0, 1]);
  });

  it('does not allow to register a user with an existing email', async () => {
    const res = await service.register(
      new User('Mar vagyok', 'marvan@email.com', 'password'),
    );
    expect(res).toEqual({ message: 'Email is already taken!' });
  });

  it('can save a user', async () => {
    const res = await service.saveUser(await service.findUserById(1));
    expect(res.message).toContain('User entry succesfully saved');
  });

  it('can delete a user', async () => {
    const res = await service.deleteUser(await service.findUserById(1));
    expect(res.message).toContain('User was deleted');
  });
});
