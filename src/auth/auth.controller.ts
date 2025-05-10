import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOTPDto } from './dtos/send-otp.dto';
import { Request, Response } from 'express';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send')
  @ApiOperation({ summary: 'send otp to user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'otp sent successfully' })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'too many request',
  })
  async send(@Body() body: SendOTPDto) {
    const sendOtp = await this.authService.sendOtp(body.phone);

    if (!sendOtp.otp) {
      return {
        data: sendOtp.otp,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: sendOtp.message,
      };
    }

    return {
      data: sendOtp.otp,
      statusCode: HttpStatus.OK,
      message: sendOtp.message,
    };
  }

  @Post('/verify')
  @ApiOperation({ summary: 'verify user otp' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'user register successfully',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user login successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found otp' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'invalid otp' })
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

  @ApiBearerAuth()
  @Get('/me')
  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user info sent successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found user' })
  @UseGuards(JwtAuthGuard)
  async getMe(@getUser() user: User) {
    const userInfos = await this.authService.getMe(user.id);

    return {
      data: userInfos,
      statusCode: HttpStatus.OK,
      message: 'User infos sent successfully',
    };
  }

  @ApiCookieAuth('refreshToken')
  @Post('/refresh')
  @ApiOperation({ summary: 'refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'access-token generated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found token' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'token is expired',
  })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    const accessToken = await this.authService.refreshToken(refreshToken);

    return res.status(HttpStatus.OK).json({
      data: accessToken,
      statusCode: HttpStatus.OK,
      message: 'access-token generated successfully',
    });
  }

  @ApiCookieAuth('refreshToken')
  @Post('/logout')
  @ApiOperation({ summary: 'log out user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user log out successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found token' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'token not found',
  })
  async logOut(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logOut(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
    });

    return res.status(HttpStatus.OK).json({
      data: '',
      statusCode: HttpStatus.OK,
      message: 'user log out successfully',
    });
  }
}
