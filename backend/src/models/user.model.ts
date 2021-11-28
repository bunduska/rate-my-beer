import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
