import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    this.usersRepository.save(createUserDto);

    // return 'This action adds a new user';
  }

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    // console.log(userExist);

    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입 불가');
    }
    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        email: emailAddress,
      },
    });

    if (!user) return false;
    return true;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.usersRepository.save({
      name,
      email,
      password,
      signupVerifyToken,
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급

    throw new Error('Method not implemented.');
  }

  // async login(email: string, password: string): Promise<string> {
  //   // TODO
  //   // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
  //   // 2. JWT를 발급

  //   throw new Error('Method not implemented.');
  // }

  // async getUserInfo(userId: string): Promise<UserInfo> {
  //   // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
  //   // 2. 조회된 데이터를 UserInfo 타입으로 응답

  //   throw new Error('Method not implemented.');
  // }

  async remove(id: number) {
    return 'remove method';
  }
}
