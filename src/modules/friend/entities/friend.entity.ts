import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  ACCEPT = 'accept',
  CANCEL = 'cancel',
  PENDING = 'pending',
}

@Entity({ name: 'friendShip' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  sender: User;

  @Column()
  senderId: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  reciver: User;

  @Column()
  reciverId: number;

  @Column({ default: Status.PENDING })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;
}

export class FriendShipRespons {
  @Exclude()
  senderId: User;

  @Exclude()
  reciverId: User;

  constructor(friend: Partial<Friend>) {
    Object.assign(this, friend);
  }
}
