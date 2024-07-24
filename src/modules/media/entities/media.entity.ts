import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cloudId: string;

  @Column()
  url: string;

  @Column()
  format: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @CreateDateColumn()
  creatAt: Date;
}
