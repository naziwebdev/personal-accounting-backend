import { Redis } from 'ioredis';
import * as bcrypt from 'bcrypt';

export const getOtpRedisPattern = (phone: string) => {
  return `otp:${phone}`;
};

export const getOtpDetails = async (redisClient: Redis, phone: string) => {
  const pattern = getOtpRedisPattern(phone);

  try {
    const otp = await redisClient.get(pattern);
    if (!otp) {
      return { expired: true, remainingTime: 0 };
    }

    const remainingTime = await redisClient.ttl(pattern);
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
    return {
      expired: false,
      remainingTime: formattedTime,
    };
  } catch (error) {
    throw error;
  }
};



