import { createClient } from 'redis';
import { ENV } from './env/env';

const redisClient = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
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
