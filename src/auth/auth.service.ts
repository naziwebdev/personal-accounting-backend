import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly patternCodeID = 2962;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
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
