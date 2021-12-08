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

const newUser: User = new User('uj', 'mi@mi.com', 'ninini');
const newBeer: Beer = {
  id: 1,
  name: 'newbeer',
  rating: 2,
  type: 'világos',
  abv: 4,
  brewery: 'Kanizsai',
  country: 'Madzsar',
  city: 'Nagykanizsa',
  imageUrl: '',
  comment: 'ittam már jobbat is',
  date: undefined,
  user: undefined,
} as Beer;
const TOKEN_PREFIX = 'Bearer';

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

  it('should get a greeting message from root endpoint)', async () => {
    const response = await request(app.getHttpServer()).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`Rate Beer App's backend database greets you!`);
  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/register')
      .send(newUser);
    expect(response.statusCode).toBe(201);
  });

  it('should not register a new user with an existing e-mail address', async () => {
    const response = await request(app.getHttpServer())
      .post('/register')
      .send(newUser);
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
      .send({ email: newUser.email, password: 'nincs' });
    expect(response.body).toStrictEqual({
      message: 'Please validate your e-mail!',
    });
  });

  it('should log in the user after e-mail validation', async () => {
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepo.query("UPDATE ratemybeer_test.user SET isValidated = '1'");

    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    expect(response.text).toContain('token');
  });

  it('should be able to save a new beer for an existing user', async () => {
    const responseForLogin = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    const token: { token: string } = responseForLogin.body;

    const response = await request(app.getHttpServer())
      .post('/savebeer')
      .send(newBeer)
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    expect(response.text).toContain('Beer entry succesfully saved');
  });

  it('should be able to return the beerlist of an existing user', async () => {
    const responseForLogin = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    const token: { token: string } = responseForLogin.body;

    const response = await request(app.getHttpServer())
      .get('/beerlist')
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    const beerlist: Beer[] = response.body as Beer[];

    expect(beerlist.length).toBeGreaterThan(0);
  });

  it('should be able to update an existing beer', async () => {
    const responseForLogin = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });

    const token: { token: string } = responseForLogin.body;

    newBeer.rating = 5;
    newBeer.comment = 'nem vót az olyan rossz';

    await request(app.getHttpServer())
      .post('/savebeer')
      .send(newBeer)
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    const response = await request(app.getHttpServer())
      .get('/beerlist')
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    const beerlist: Beer[] = response.body as Beer[];
    expect(beerlist[0].rating).toBe(5);
    expect(beerlist[0].comment).toBe('nem vót az olyan rossz');
  });

  it('should be able to delete an existing beer', async () => {
    const responseForLogin = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    const token: { token: string } = responseForLogin.body;

    const response = await request(app.getHttpServer())
      .get('/beerlist')
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);
    const beerlist: Beer[] = response.body as Beer[];

    const responseToDelete = await request(app.getHttpServer())
      .delete('/deletebeer')
      .send(beerlist[0])
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    expect(responseToDelete.text).toContain('Beer entry was deleted.');
  });

  it('should allow only to an admin to update a user', async () => {
    const responseForLogin = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    const token: { token: string } = responseForLogin.body;

    newUser.isAdmin = true;

    const response = await request(app.getHttpServer())
      .post('/user/update')
      .send(newUser)
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    expect(response.status).toBe(401);
    expect(response.text).toContain('Invalid token');
  });

  it('should allow to update a user for an admin', async () => {
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepo.query("UPDATE ratemybeer_test.user SET isAdmin= '1'");

    const responseForLogin = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    const token: { token: string } = responseForLogin.body;

    const response = await request(app.getHttpServer())
      .post('/user/update')
      .send(newUser)
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    expect(response.status).toBe(201);
    expect(response.text).toContain('User entry succesfully saved');
  });

  it('should allow to update a user for an admin', async () => {
    const responseForLogin = await request(app.getHttpServer())
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    const token: { token: string } = responseForLogin.body;

    const response = await request(app.getHttpServer())
      .get('/user/list')
      .set('Authorization', `${TOKEN_PREFIX} ${token.token} `);

    const userList: User[] = response.body as User[];

    expect(response.status).toBe(200);
    expect(userList.length).toBeGreaterThan(0);
  });
});
