import { Chat } from 'src/modules/chat/entities/chat.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Msg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  sender: User;

  @ManyToOne(() => Chat, (chat) => chat.msgs, { nullable: true })
  chat: Chat;

  @Column()
  chatId: number;

  @Column()
  senderId: number;

  @OneToOne(() => Media, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  media: Media;

  @Column({ nullable: true })
  mediaId: number;

  @CreateDateColumn()
  sentAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
