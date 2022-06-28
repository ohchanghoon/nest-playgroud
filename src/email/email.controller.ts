import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async checkVerifyEmail(@Query('token') token) {
    await this.emailService.find(token);
  }
}
