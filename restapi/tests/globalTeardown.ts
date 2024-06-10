import mongoose from 'mongoose';

module.exports = async () => {
    if (mongoose.connection.readyState !== 0) {
        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            await collection.drop();
        }

        await mongoose.connection.close();
    }
};
