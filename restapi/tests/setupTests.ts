import mongoose from 'mongoose';

beforeAll(async () => {
  const mongoUri = process.env.TEST_MONGO_URI!;
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
