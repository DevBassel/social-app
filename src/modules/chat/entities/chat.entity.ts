import { Msg } from 'src/modules/msgs/entities/msg.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
    onDelete: 'SET NULL',
  })
  sender: User;

  @Column()
  senderId: number;

  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  recevier: User;

  @Column()
  receiverId: number;

  @OneToMany(() => Msg, (msg) => msg.chat)
  msgs: Msg[];

  @CreateDateColumn()
  createdAt: Date;
}
