import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as uuid from 'uuid';
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
  async create(createUserDto: CreateUserDto) {
    this.usersRepository.save(createUserDto);

    // return 'This action adds a new user';
  }

  async createUser(name: string, email: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userExist = await this.checkUserExists(email);
      if (userExist) {
        throw new UnprocessableEntityException('해당 이메일로는 가입 불가');
      }
      const signupVerifyToken = uuid.v1();

      await this.saveUser(name, email, password, signupVerifyToken);
      await this.sendMemberJoinEmail(email, signupVerifyToken);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
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
    this.dataSource.transaction(async (manager) => {
      await this.usersRepository.save({
        name,
        email,
        password,
        signupVerifyToken,
      });
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

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

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('비회원임');
    }
    return this.authService.login({
      id: user.id,
      password: user.password,
      email: user.email,
    });
  }

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
