import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  to: User;

  @Column({ nullable: true })
  toId: number;

  @CreateDateColumn()
  createdAt: Date;
}
