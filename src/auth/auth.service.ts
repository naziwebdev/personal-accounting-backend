import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import {
  generateOtp,
  getOtpDetails,
  getOtpRedisPattern,
} from './helpers/otp-redis';

@Injectable()
export class AuthService {
  private readonly patternCodeID = 2962;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redisClient: Redis,
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

  async sendOtp(phone: string) {
    const { expired, remainingTime } = await getOtpDetails(
      this.redisClient,
      phone,
    );
    if (!expired) {
      return {
        message: `otp sent already try again after ${remainingTime}`,
        otp: null,
      
      };
    }

    const otp = await generateOtp(this.redisClient, phone);

    // await this.sendSms(phone,otp)

    return {
      message: 'otp send successfully',
      otp,
    };
  }

 async verify (phone:string,otp:string){

 }
  
}
