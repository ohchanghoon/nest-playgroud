import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAuthGuard } from './users/users-auth/users-auth.guard';
import { UsersAuthModule } from './users/users-auth/users-auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, UsersAuthModule],
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
