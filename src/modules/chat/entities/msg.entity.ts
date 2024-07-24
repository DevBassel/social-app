import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'messags' })
export class Msgs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  media: string;

  @ManyToOne(() => Chat, (chat) => chat.messags, { onDelete: 'CASCADE' })
  chat: Chat;

  @Column()
  chatId: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  sender: User;

  @Column()
  senderId: number;

  @Column()
  reciverId: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  reciver: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
