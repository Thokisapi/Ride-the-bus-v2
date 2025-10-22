const User = require("../models/users");
const Role = require('../models/roles');
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { username, firstname, email, password } = req.body;

  if (!username || !firstname || !email || !password) {
    return res.status(400).json({ message: 'Please enter a username, firstname, email, and password' });
  }

const userRole = await Role.findOne({ name: 'user' }); 
const duplicate = await User.findOne({ username }).exec();
  if (duplicate) return res.status(409).json({ message: 'Username already exists' });
  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const result = await new User({
      username: username,
      firstname: firstname,
      password: hashedpassword,
      email: email,
      role: userRole._id,
    }).save();
    console.log(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.redirect('/lobby')
};

const allUsers = async (req, res) =>{
  const users = await User.find()
  console.log(users);
};


module.exports = { createUser, allUsers };
