import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.model';

@Entity()
export class Beer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  type: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  abv: number;

  @Column({ default: '' })
  brewery: string;

  @Column({ default: '' })
  country: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: '' })
  imageUrl: string;

  @Column({ type: 'longtext' })
  comment: string;

  @Column()
  rating: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.beers, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  user: User;

}
