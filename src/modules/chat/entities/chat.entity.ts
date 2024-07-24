import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Msgs } from './msg.entity';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  sender: User;

  @Column()
  senderId: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  reciever: User;

  @Column()
  recieverId: number;

  @OneToMany(() => Msgs, (msgs) => msgs.chat)
  messags: Msgs[];

  @CreateDateColumn()
  createdAt: Date;
}
