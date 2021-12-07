import { BeersService } from './beers/beers.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from './config/config.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { Beer } from './models/beer.model';

describe('AppController', () => {
  let appController: AppController;
  let spyService: AuthService;
  let spy2Service: UsersService;
  let spy3Service: BeersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        BeersService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: () => {
              return Promise.resolve([
                1,
                'Vagyok',
                'password',
                'valaki@email.com',
                0,
                0,
              ]);
            },
            find: () => {
              return Promise.resolve([
                1,
                'Vagyok',
                'password',
                'valaki@email.com',
                0,
                1,
              ]);
            },
          },
        },
        {
          provide: getRepositoryToken(Beer),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    spyService = app.get<AuthService>(AuthService);
    spy2Service = app.get<UsersService>(UsersService);
    spy3Service = app.get<BeersService>(BeersService);
  });

  it('should call the authentication service in case of a login', async () => {
    const mockRequest = <Request>(<unknown>{
      body: { email: 'valaki@email.com', password: 'jelszo' },
    });

    const res = await appController.login(mockRequest);
    expect(res).toEqual({ message: 'Please validate your e-mail!' });
    expect(spyService).toBeInstanceOf(Object);
    expect(spyService).not.toBeNull;
  });

  it('should call the users service in case of a registration', async () => {
    const mockRequest = <Request>(<unknown>{
      body: {
        username: 'valaki',
        email: 'valaki@email.com',
        password: 'jelszo',
      },
    });

    const res = await appController.register(mockRequest);
    expect(res).toEqual({ message: 'Email is already taken!' });
    expect(spy2Service).toBeInstanceOf(Object);
    expect(spy2Service).not.toBeNull;
  });

  it('should call the users service in case of a user modification/list/deletion', async () => {
    const mockRequest = <Request>(<unknown>{
      body: {
        userId: '1',
        username: 'valaki',
        email: 'valaki@email.com',
        password: 'jelszo',
      },
    });

    await appController.userlist(mockRequest);
    expect(spy2Service).toBeInstanceOf(Object);
    expect(spy2Service).not.toBeNull;

    await appController.saveuser(mockRequest);
    expect(spy2Service).toBeInstanceOf(Object);
    expect(spy2Service).not.toBeNull;

    await appController.deleteuser(mockRequest);
    expect(spy2Service).toBeInstanceOf(Object);
    expect(spy2Service).not.toBeNull;
  });

  it('should call the beers service in case of a beer save/deletion', async () => {
    const mockRequest = <Request>(<unknown>{
      body: {},
    });

    await appController.savebeer(mockRequest);
    expect(spy3Service).toBeInstanceOf(Object);
    expect(spy3Service).not.toBeNull;

    await appController.deletebeer(mockRequest);
    expect(spy3Service).toBeInstanceOf(Object);
    expect(spy3Service).not.toBeNull;
  });
});
