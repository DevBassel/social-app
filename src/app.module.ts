import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './modules/DB/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalJwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { FavoriteModule } from './modules/favorites/favorite.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CommentModule } from './modules/comment/comment.module';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MeadiModule } from './modules/media/media.module';
import { ChatModule } from './modules/chat/chat.module';
import { MsgsModule } from './modules/msgs/msgs.module';
import { FriendsModule } from './modules/friends/friends.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    GlobalJwtModule,
    UserModule,
    PostModule,
    FavoriteModule,
    NotificationModule,
    CommentModule,
    CloudinaryModule,
    MeadiModule,
    ChatModule,
    MsgsModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
