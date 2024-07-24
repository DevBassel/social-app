import { Post } from '../../post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostLove } from '../../post/entities/postLove.entity';
import { ProviderType } from '../enums/ProviderType.enum';
import { RoleType } from 'src/decorators/enums/Roule.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ default: RoleType.User })
  role: RoleType;

  @Column()
  provider: ProviderType;

  @Column({ nullable: true })
  providerId: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostLove, (postlove) => postlove.user)
  loves: PostLove[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class UserRes extends User {
  // @Exclude()
  // providerId: string;

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
