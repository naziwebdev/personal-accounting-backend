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

export const generateOtp = async (
  redisClient: Redis,
  phone: string,
  length = 4,
  expireTime = 2,
) => {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  const hashedOtp = await bcrypt.hash(otp, 12);

  try {
    await redisClient.set(
      getOtpRedisPattern(phone),
      hashedOtp,
      'EX',
      expireTime * 60,
    );
  } catch (error) {
    throw new Error(`Error setting OTP in Redis: ${error.message}`);
  }

  return otp;
};
