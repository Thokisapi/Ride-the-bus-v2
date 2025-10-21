const User = require("../models/users");
const bcrypt = require('bcrypt');


const login = async (req, res) =>{
     const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({ username }).exec();
    if(!user){
         return res.status(400).json({ message: 'Please enter correct login information' });
    }
     const matchPassword = await bcrypt.compare(password, user.password);
     if (!matchPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    } 
    res.redirect('/lobby')

}
module.exports = {
    login,
};

