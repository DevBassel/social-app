import { Exclude } from 'class-transformer';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  post: Post;

  @Column()
  postId: number;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}

export class FavoriteResponse {
  @Exclude()
  postId: number;

  @Exclude()
  userId: number;

  constructor(fav: Partial<Favorite>) {
    Object.assign(this, fav);
  }
}
