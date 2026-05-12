const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../server/models/User');

dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seedAdmin() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to server/.env before running the seed.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const adminData = {
    name: 'Default Admin',
    email: 'admin@example.com',
    password: 'Admin12345',
    role: 'admin',
    permissions: ['ALL_ACCESS'],
  };

  const existingAdmin = await User.findOne({ email: adminData.email }).select('+password');

  if (existingAdmin) {
    existingAdmin.name = adminData.name;
    existingAdmin.password = adminData.password;
    existingAdmin.role = adminData.role;
    existingAdmin.permissions = adminData.permissions;
    await existingAdmin.save();
    console.log('Default admin updated: admin@example.com / Admin12345');
  } else {
    await User.create(adminData);
    console.log('Default admin created: admin@example.com / Admin12345');
  }

  await mongoose.disconnect();
}

seedAdmin().catch(async error => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
