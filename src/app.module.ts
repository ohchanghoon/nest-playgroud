import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './users/auth/auth.guard';
import { UsersAuthModule } from './users/auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { HandlerRolesGuard } from './users/auth/handlerRoles.guard';
import { ClassRolesGuard } from './users/auth/classRoles.guard';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

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
      // logging: 'all',
      entities: [UserEntity],
      synchronize: true,
    }),
    UsersModule,
    UsersAuthModule,
    EmailModule,
    AuthModule,
    WinstonModule.forRoot({
      transports: [
        // transport 옵션 설정
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly', // 로그 레벨 지정
          format: winston.format.combine(
            winston.format.timestamp(), // 로그 남긴 시각 함께 표시
            // 어디에 로그를 남겼는지를 구분하는 appname과 로그를 읽기 쉽도록 하는 옵션인 prettyPrint 옵션을 설정
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: HandlerRolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ClassRolesGuard,
    },
  ],
})
export class AppModule {}
