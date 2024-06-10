import mongoose from 'mongoose';

module.exports = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    const mongoServer = globalThis.__MONGOD__;
    await mongoServer.stop();
};
