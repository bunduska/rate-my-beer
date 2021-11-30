import { Beer } from '../models/beer.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class BeersService {
  constructor(
    @InjectRepository(Beer)
    private beersRepository: Repository<Beer>,
  ) {}

  async findAllBeersOfUser(): Promise<Beer[]> {
    return this.beersRepository.find();
  }

  async findUserByEmail(email: string): Promise<Beer | undefined> {
    return this.beersRepository.findOne({ where: { email } });
  }

  async saveNewBeer(beerToSave: Beer): Promise<{ message: string }> {
    try {
      await this.beersRepository.save(beerToSave);
      return { message: `Beer entry succesfully saved (with id ${beerToSave.id}).` };
    } catch {
      return { message: 'Error when saving beer record!!!' };
    }
  }
}
