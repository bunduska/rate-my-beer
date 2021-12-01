import { UsersService } from './../users/users.service';
import { Beer } from '../models/beer.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';

@Injectable()
export class BeersService {
  constructor(
    @InjectRepository(Beer)
    private beersRepository: Repository<Beer>,
    private usersService: UsersService,
  ) {}

  async findAllBeersOfUser(): Promise<Beer[]> {
    return this.beersRepository.find();
  }

  async findUserByEmail(email: string): Promise<Beer | undefined> {
    return this.beersRepository.findOne({ where: { email } });
  }

  async saveBeer(
    beerToSave: Beer,
    userId: number,
  ): Promise<{ message: string }> {
    try {
      const user: User = await this.usersService.findUserById(userId);
      beerToSave.user = user;
      await this.beersRepository.save(beerToSave);
      return {
        message: `Beer entry succesfully saved (id ${beerToSave.id}).`,
      };
    } catch {
      return { message: 'Error when saving beer record!!!' };
    }
  }

  async deleteBeer(beerToDelete: Beer): Promise<{ message: string }> {
    try {
      await this.beersRepository.delete(beerToDelete.id);
      return {
        message: `Beer entry was deleted.`,
      };
    } catch {
      return { message: 'Error when deleting beer record!!!' };
    }
  }

  async getBeerList(userId: number): Promise<Beer[]> {
    return this.beersRepository
      .createQueryBuilder()
      .relation(User, 'beers')
      .of(userId)
      .loadMany();
  }
}
