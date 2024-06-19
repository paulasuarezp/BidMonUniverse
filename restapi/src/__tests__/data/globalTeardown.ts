import mongoose from 'mongoose';

module.exports = async () => {
    if (mongoose.connection.readyState !== 0) {
        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            console.log(`Dropping collection ${collection.collectionName}`);
            await collection.drop();
        }

        await mongoose.connection.close();
    }
};
