import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { EMAIL_PASSWORD, SENDER_EMAIL } from 'src/users/const';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @InjectRepository(UserEntity) private userEntity: Repository<UserEntity>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: SENDER_EMAIL,
        pass: EMAIL_PASSWORD,
        // user: 'lovelyoch123@gmail.com', // TODO: config
        // pass: 'nwivmbvqgwrfdmhw', // TODO: config
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000'; // TODO: config

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };
    return await this.transporter.sendMail(mailOptions);
  }

  async find(token) {
    const user = await this.userEntity.findOne({
      where: {
        signupVerifyToken: token,
      },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    // return this.authService.login({
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    // });
  }
}
