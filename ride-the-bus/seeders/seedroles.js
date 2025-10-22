const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Role = require('../models/roles');
const User = require('../models/users');


const seedDatabase = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ride-the-bus');


    await Role.deleteMany({});
    await User.deleteMany({});


    const adminRole = await Role.create({ name: 'admin' });
    const userRole = await Role.create({ name: 'user' });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      username: 'Thokisapi',
      firstname: 'Thom',
      email: 'thomvandervorst@ride-the-bus.com',
      password: hashedPassword,
      role: adminRole._id
    });

    await adminUser.save();

    console.log('Seeded roles and admin user successfully');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
};

seedDatabase();