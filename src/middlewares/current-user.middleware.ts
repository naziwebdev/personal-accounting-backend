import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
        const payload = this.jwtService.verify(token, { secret: secretKey });
        const userId = payload.userId;

        if (userId) {
          const user = await this.usersService.findById(userId);
          if (user) {
            req.currentUser = user;
          }
        }
      } catch (error) {
        console.error('JWT verification failed:', error);
      }
    }

    next();
  }
}
