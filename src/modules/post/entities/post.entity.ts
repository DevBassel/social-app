import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostLove } from './postLove.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  media: string;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => PostLove, (post) => post.post)
  loves: PostLove[];

  @Column()
  lang: string;

  @Column({ default: 0 })
  totalLoves: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
