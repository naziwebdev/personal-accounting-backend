import { Redis } from 'ioredis';
import * as bcrypt from 'bcrypt';

export const getRefreshTokenRedisPattern = (userId: number) => {
  return `refreshToken:${userId}`;
};

export const setRefreshTokenInRedis = async (
  redisClient: Redis,
  refreshToken: string,
  userId: number,
) => {
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  try {
    await redisClient.set(
      getRefreshTokenRedisPattern(userId),
      hashedRefreshToken,
      'EX',
      30 * 24 * 60 * 60,
    );
  } catch (error) {
    throw new Error(`Error setting refresh-token in Redis: ${error.message}`);
  }
};

export const getRefreshTokenRedis = async (
  redisClient: Redis,
  userId: number,
) => {
  const pattern = getRefreshTokenRedisPattern(userId);
  try {
    const refreshToken = await redisClient.get(pattern);
    if (!refreshToken) {
      return {
        expired: true,
        refreshToken: null,
      };
    }
    return {
      expired: false,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteRefreshTokenFromRedis = async (
  redisClient: Redis,
  userId: number,
) => {
  const pattern = getRefreshTokenRedisPattern(userId);

  try {
    await redisClient.del(pattern);
  } catch (error) {
    throw error
  }

};
