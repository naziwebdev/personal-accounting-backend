import { Body, Controller, Post, Res, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOTPDto } from './dtos/send-otp.dto';
import { Response } from 'express';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send')
  async send(@Body() body: SendOTPDto, @Res() res: Response) {
    const sendOtp = await this.authService.sendOtp(body.phone);

    if (!sendOtp.otp) {
      return res.status(HttpStatus.OK).json({
        data: sendOtp.otp,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: sendOtp.message,
      });
    }

    return res.status(HttpStatus.OK).json({
      data: sendOtp.otp,
      statusCode: HttpStatus.OK,
      message: sendOtp.message,
    });
  }

  @Post('/verify')
  async verify(@Body() body: VerifyOtpDto, @Res() res: Response) {
    const verify = await this.authService.verify(body.phone, body.otp);

    if (verify.isRegister) {
      //login
      res.cookie('refreshToken', verify.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.status(HttpStatus.OK).json({
        data: {
          accessToken: verify.accessToken,
          user: verify.existUser,
        },
        statusCode: HttpStatus.OK,
        message: 'user login successfully',
      });
    }

    //register
    res.cookie('refreshToken', verify.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(HttpStatus.CREATED).json({
      data: {
        accessToken: verify.accessToken,
        user: verify.newUser,
      },
      statusCode: HttpStatus.CREATED,
      message: 'user register successfully',
    });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@getUser() user: User, @Res() res: Response) {
    const userInfos = await this.authService.getMe(user.id);

    return res.status(HttpStatus.OK).json({
      data: userInfos,
      statusCode: HttpStatus.OK,
      message: 'user infos send successfully',
    });
  }
}
