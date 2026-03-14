const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'jest-test'
    },
    spawn: {
        // Increase timeout for binary download/spawn
    }
  });
  global.__MONGO_URI__ = mongoServer.getUri();
  global.__MONGO_SERVER__ = mongoServer;
};
