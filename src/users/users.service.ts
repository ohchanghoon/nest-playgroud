import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private emailService: EmailService,
    private authService: AuthService,
  ) {}

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return this.authService.login({
      id: user.id,
      email: user.email,
      password: user.password,
    });
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
  }
  // async login(email: string, password: string): Promise<string> {
  //   const user = await this.usersRepository.findOne({
  //     where: { email, password },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('비회원임');
  //   }
  //   return this.authService.login({
  //     id: user.id,
  //     password: user.password,
  //     email: user.email,
  //   });
  // }

  async getUserInfo(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async remove(id: number) {
    return 'remove method';
  }
}
