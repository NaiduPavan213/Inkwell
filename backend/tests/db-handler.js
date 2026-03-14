const mongoose = require('mongoose');

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
        const uri = global.__MONGO_URI__;
        await mongoose.connect(uri);
    }
};

/**
 * Close the connection.
 */
module.exports.closeDatabase = async () => {
    // We don't drop database here because it's handled by clearDatabase or global teardown
    // Just close the connection
    await mongoose.connection.close();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    if (mongoose.connection.readyState === 0) return;
    
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};
