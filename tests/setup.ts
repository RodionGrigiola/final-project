import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import User from '../src/model/userModel'; 
import Email from '../src/services/Email'; 
import { IUser } from '../src/types';


export const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'test1234',
  passwordConfirmation: 'test1234'
};

jest.mock('../src/services/Email', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation((user: IUser, url: string) => ({
      sendWelcome: jest.fn().mockResolvedValue(true)
    }))
  }));

export const testPhotoPath = path.join(__dirname, 'fixtures', 'test-user.jpg');

// Database setup/teardown
export const setupTestDB = () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_DATABASE as string);
    }

    if (!fs.existsSync(testPhotoPath)) {
      throw new Error(`Test image missing at ${testPhotoPath}`);
    }
  });

  beforeEach(async () => {
    (Email as jest.Mock).mockClear();
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
};