import { MongoMemoryServer } from 'mongodb-memory-server';

export default async (): Promise<void> => {
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'jest-test'
    }
  });
  (global as any).__MONGO_URI__ = mongoServer.getUri();
  (global as any).__MONGO_SERVER__ = mongoServer;
};
