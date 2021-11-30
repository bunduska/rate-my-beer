import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Beer {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column({ default: '' })
  type: string;
  
  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0, }  )
  abv: number;
  
  @Column({ default: '' })
  brewery: string;
  
  @Column({ default: '' })
  country: string;
  
  @Column({ default: '' } )
  city: string;
  
  @Column({ default: '' })
  imageUrl: string;
  
  @Column({ type: "longtext" })
  comment: string;
  
  @Column()
  rating: number;
}
