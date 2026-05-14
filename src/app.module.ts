import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './modules/DB/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { FavoriteModule } from './modules/favorites/favorite.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CommentModule } from './modules/comment/comment.module';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MediaModule } from './modules/media/media.module';
import { ChatModule } from './modules/chat/chat.module';
import { MsgsModule } from './modules/msgs/msgs.module';
import { FriendsModule } from './modules/friends/friends.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),

    DbModule,
    AuthModule,
    UserModule,
    PostModule,
    FavoriteModule,
    NotificationModule,
    CommentModule,
    CloudinaryModule,
    MediaModule,
    ChatModule,
    MsgsModule,
    FriendsModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
