import { createClient } from 'redis';
import { ENV } from './env/env';

const redisClient = createClient({

  password: ENV.REDIS_PASSWORD as string,
  socket: {
    host: ENV.REDIS_HOST,
    port: Number(ENV.REDIS_PORT),

  },
});
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
  }
};

export { connectRedis, redisClient };
