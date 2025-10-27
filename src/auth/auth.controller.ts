import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOTPDto } from './dtos/send-otp.dto';
import { Request, Response } from 'express';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
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

    console.log(sendOtp.otp);

    return {
      data: sendOtp.otp,
      statusCode: HttpStatus.OK,
      message: sendOtp.message,
    };
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('/verify')
  // @ApiOperation({ summary: 'verify user otp' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'user register successfully',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'user login successfully',
  // })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found otp' })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'invalid otp' })
  // async verify(@Body() body: VerifyOtpDto, @Res() res: Response) {
  //   const verify = await this.authService.verify(body.phone, body.otp);

  //   if (verify.isRegister) {
  //     //login
  //     res.cookie('refreshToken', verify.refreshToken, {
  //       httpOnly: true,
  //       sameSite: 'strict',
  //       maxAge: 30 * 24 * 60 * 60 * 1000,
  //     });
  //     return res.status(HttpStatus.OK).json({
  //       data: {
  //         accessToken: verify.accessToken,
  //         user: verify.existUser,
  //       },
  //       statusCode: HttpStatus.OK,
  //       message: 'user login successfully',
  //     });
  //   }

  //   //register
  //   res.cookie('refreshToken', verify.refreshToken, {
  //     httpOnly: true,
  //     sameSite: 'strict',
  //     maxAge: 30 * 24 * 60 * 60 * 1000,
  //   });
  //   return res.status(HttpStatus.CREATED).json({
  //     data: {
  //       accessToken: verify.accessToken,
  //       user: verify.newUser,
  //     },
  //     statusCode: HttpStatus.CREATED,
  //     message: 'user register successfully',
  //   });
  // }

  @HttpCode(HttpStatus.OK)
  @Post('/verify')
  @ApiOperation({ summary: 'Verify user OTP' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'OTP not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid OTP' })
  async verify(
    @Body() body: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const verify = await this.authService.verify(body.phone, body.otp);

    res.cookie('refreshToken', verify.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const user = verify.isRegister ? verify.existUser : verify.newUser;
    const statusCode = verify.isRegister ? HttpStatus.OK : HttpStatus.CREATED;
    const message = verify.isRegister
      ? 'User login successfully'
      : 'User register successfully';

    return {
      data: {
        accessToken: verify.accessToken,
        user,
      },
      statusCode,
      message,
    };
  }

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
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
