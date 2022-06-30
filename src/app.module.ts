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
      logging: 'all',
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
