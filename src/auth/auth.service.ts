import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import * as bcrypt from 'bcrypt';
import {
  generateOtp,
  getOtpDetails,
  getOtpRedisPattern,
} from './helpers/otp-redis';
import {
  getRefreshTokenRedis,
  setRefreshTokenInRedis,
} from './helpers/refresh-token-redis';

@Injectable()
export class AuthService {
  private readonly patternCodeID = 2962;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redisClient: Redis,
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

  async verify(phone: string, otp: string) {
    const userOtp = await this.redisClient.get(getOtpRedisPattern(phone));
    if (!userOtp) {
      throw new BadRequestException('not found otp');
    }

    const isValidOtp = await bcrypt.compare(otp, userOtp);
    if (!isValidOtp) {
      throw new BadRequestException('otp is invalid');
    }

    const existUser = await this.usersService.findByPhone(phone);
    if (existUser) {
      const userID = existUser.id;
      const accessToken = this.jwtService.sign(
        {
          userId: existUser.id,
        },
        {
          secret: this.jwtSecret,
          expiresIn: this.jwtExpiresIn,
        },
      );
      const refreshToken = this.jwtService.sign(
        {
          userId: existUser.id,
        },
        {
          secret: this.refreshSecret,
          expiresIn: this.refreshExpiresIn,
        },
      );

      await setRefreshTokenInRedis(this.redisClient, refreshToken, userID);
      return { isRegister: true, existUser, accessToken, refreshToken };
    }

    const newUser = await this.usersService.create(phone);
    const userID = newUser.id;
    const accessToken = this.jwtService.sign(
      {
        userId: newUser.id,
      },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtExpiresIn,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: newUser.id,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      },
    );
    await setRefreshTokenInRedis(this.redisClient, refreshToken, userID);
    return { isRegister: false, newUser, accessToken, refreshToken };
  }

  async getMe(id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('not found user');
    }

    return user;
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new NotFoundException('not found token');
    }

    const payload = this.jwtService.verify(token, {
      secret: this.refreshSecret,
    });

    if (!payload) {
      throw new UnprocessableEntityException('token is invalid');
    }

    const user = await this.usersService.findById(payload.userId);

    if (!user) {
      throw new UnprocessableEntityException('token is invalid');
    }

    const refreshTokenInRedis = await getRefreshTokenRedis(
      this.redisClient,
      user.id,
    );

    if (refreshTokenInRedis.expired) {
      throw new BadRequestException('token is expired');
    }

    const isValidToken = await bcrypt.compare(
      token,
      refreshTokenInRedis.refreshToken!,
    );

    if (!isValidToken) {
      throw new BadRequestException('token is invalid');
    }

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtExpiresIn,
      },
    );

    return accessToken;
  }
}
