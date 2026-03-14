import mongoose from 'mongoose';

/**
 * Connect to the in-memory database.
 */
export const connect = async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
        const uri = (global as any).__MONGO_URI__;
        await mongoose.connect(uri);
    }
};

/**
 * Close the connection.
 */
export const closeDatabase = async (): Promise<void> => {
    await mongoose.connection.close();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) return;
    
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};
