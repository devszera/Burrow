import bcrypt from 'bcryptjs';
import Warehouse from '../models/Warehouse.js';
import User from '../models/User.js';
import { defaultWarehouses } from './defaultWarehouses.js';

export const seedInitialData = async () => {
  const warehouseCount = await Warehouse.estimatedDocumentCount();
  if (warehouseCount === 0) {
    await Warehouse.insertMany(defaultWarehouses);
  }

  const defaultUsers = [
    {
      name: 'Admin User',
      email: 'admin@burrow.com',
      password: 'admin123',
      role: 'operator',
      phone: '9876543210',
    },
    {
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'consumer',
      phone: '9876543210',
    },
  ];

  await Promise.all(
    defaultUsers.map(async (user) => {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: hashedPassword });
      }
    })
  );
};
