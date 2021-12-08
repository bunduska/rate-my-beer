import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from './../src/config/config.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './../src/config/config.service';
import { User } from './../src/models/user.model';
import { Beer } from './../src/models/beer.model';
import { Repository } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            type: configService.get('TYPEORM_CONNECTION'),
            host: configService.get('TYPEORM_HOST'),
            port: configService.get('TYPEORM_PORT'),
            username: configService.get('TYPEORM_USERNAME'),
            password: configService.get('TYPEORM_PASSWORD'),
            entities: [User, Beer],
            database: configService.get('TYPEORM_DATABASE'),
            synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
            logging: configService.get('TYPEORM_LOGGING'),
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Beer, User]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    await app.init();

    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    const beerRepo = app.get<Repository<Beer>>(getRepositoryToken(Beer));

    await userRepo.query('delete from ratemybeer_test.user;');
    await beerRepo.query('delete from ratemybeer_test.beer;');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get a greeting message for root endpoint)', async () => {
    const response = await request(app.getHttpServer()).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`Rate Beer App's backend database greets you!`);
  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/register')
      .send(new User('uj', 'mi@mi.com', 'ninini'));
    expect(response.statusCode).toBe(201);
  });

  it('should not register a new user with an existing e-mail address', async () => {
    const response = await request(app.getHttpServer())
      .post('/register')
      .send(new User('uj', 'mi@mi.com', 'ninini'));
    expect(response.body).toStrictEqual({ message: 'Email is already taken!' });
  });

  it('should not log in a non-existing user', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'nincs', password: 'nincs' });
    expect(response.body).toStrictEqual({ message: 'User does not exist!' });
  });

  it('should not log in a user without e-mail validation', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'mi@mi.com', password: 'nincs' });
    expect(response.body).toStrictEqual({
      message: 'Please validate your e-mail!',
    });
  });

  it('should log in the user after an e-mail validation', async () => {
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepo.query("UPDATE ratemybeer_test.user SET isValidated = '1'");

    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'mi@mi.com', password: 'ninini' });
    expect(response.text).toContain('token');
  });
});
