import { createClient } from 'redis';
import { env } from './env';

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: env.REDIS_URL });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    await redisClient.connect();
  }

  return redisClient;
};

// graceful shutdown helper
export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
  }
};
