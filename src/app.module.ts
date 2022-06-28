import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAuthGuard } from './users/users-auth/users-auth.guard';
import { UsersAuthModule } from './users/users-auth/users-auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'test_db',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [UserEntity],
      synchronize: true,
    }),
    UsersModule,
    UsersAuthModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: UsersAuthGuard,
    },
  ],
})
export class AppModule {}
