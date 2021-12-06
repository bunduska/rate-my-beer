import { ConfigService } from './../config/config.service';
import { UsersService } from './../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BeersService } from './beers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Beer } from '../models/beer.model';
import { User } from '../models/user.model';
import { JwtService } from '@nestjs/jwt';

describe('BeersService', () => {
  let service: BeersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Beer),
          useValue: {
            save: () => {
              jest.fn();
            },
            delete: () => {
              jest.fn();
            },
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: () => {
              return Promise.resolve([
                2,
                'Vagyok',
                'password',
                'marvan@email.com',
                0,
                1,
              ]);
            },
          },
        },
        BeersService,
        UsersService,
        ConfigService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BeersService>(BeersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can save a beer for a user', async () => {
    const res = await service.saveBeer(new Beer(), 1);
    expect(res.message).toContain('Beer entry succesfully saved');
  });

  it('can delete a beer', async () => {
    const res = await service.deleteBeer(new Beer());
    expect(res.message).toContain('Beer entry was deleted.');
  });


});
