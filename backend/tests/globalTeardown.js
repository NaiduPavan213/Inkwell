module.exports = async () => {
  await global.__MONGO_SERVER__.stop();
};
