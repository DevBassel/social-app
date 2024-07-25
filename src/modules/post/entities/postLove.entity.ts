import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostLove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Post, (post) => post.loves, { onDelete: 'CASCADE' })
  post: Post;

  @Column()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;
}
