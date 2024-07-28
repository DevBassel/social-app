import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendReqStatus } from '../enums/friend-req-status.enum';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'friend_ship' })
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  sender: User;

  @Column()
  senderId: number;

  @OneToOne(() => User, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  recevier: User;

  @Column()
  recevierId: number;

  @Column({ default: FriendReqStatus.PENDING, enum: FriendReqStatus })
  status: FriendReqStatus;

  @CreateDateColumn()
  createdAt: Date;
}
