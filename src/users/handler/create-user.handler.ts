import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import * as uuid from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private dataSource: DataSource,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;

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
      return 'true';
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
}
