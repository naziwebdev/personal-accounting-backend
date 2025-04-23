import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOTPDto } from './dtos/send-otp.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send')
  async send(@Body() body: SendOTPDto, @Res() res: Response) {
    const sendOtp = await this.authService.sendOtp(body.phone);

    return res.status(HttpStatus.OK).json({
      data: sendOtp.otp,
      statusCode: HttpStatus.OK,
      message: sendOtp.message,
    });
  }
}
