import { Media } from 'src/modules/media/entities/media.entity';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
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
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @OneToOne(() => Media, {
    createForeignKeyConstraints: false,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  media: Media;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @Column()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
