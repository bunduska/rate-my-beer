import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Beer } from './beer.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isValidated: boolean;

  @OneToMany(() => Beer, (beer) => beer.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  beers: Beer[];

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
