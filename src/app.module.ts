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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
