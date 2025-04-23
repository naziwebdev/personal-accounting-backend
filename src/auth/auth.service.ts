import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly patternCodeID = 2962;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService:JwtService,
    @Inject('JWT_SECRET_KEY') private readonly jwtSecret: string,
    @Inject('JWT_EXPIRESIN') private readonly jwtExpiresIn: string,
    @Inject('REFRESH_SECRET_KEY') private readonly refreshSecret: string,
    @Inject('REFRESH_EXPIRESIN') private readonly refreshExpiresIn: string,
  ) {}

  async sendSms(phone: string, otp: string) {
    const patternValues = ['کاربر عزیز', otp];
    try {
      const response = await axios.post(
        'https://portal.amootsms.com/rest/SendWithPattern',
        {
          Mobile: phone,
          PatternCodeID: this.patternCodeID.toString(),
          PatternValues: patternValues.join(','),
        },
        {
          headers: {
            Authorization: this.configService.get<string>('OPT_TOKEN'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  }



}
