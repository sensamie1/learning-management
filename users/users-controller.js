const UserModel = require('../models/user-model');
const jwt = require('jsonwebtoken');
const logger = require('../logger');


require('dotenv').config()


const CreateUser = async (req, res) => {
  try {
    logger.info('[CreateUser] => Create process started.');
    const userFromRequest = req.body;

    const existingEmailUser = await UserModel.findOne({ email: userFromRequest.email.toLowerCase() });

    if (existingEmailUser) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    // Automatically assign role based on email domain check
    const role = userFromRequest.email.includes('gemamethystngltd') ? 'admin' : 'user';

    const user = await UserModel.create({
      first_name: userFromRequest.first_name,
      last_name: userFromRequest.last_name,
      email: userFromRequest.email,
      password: userFromRequest.password,
      role,
    });

    const token = await jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info('[CreateUser] => Create process done.');
    return res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('[CreateUser] => Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      data: null,
    });
  }
};



const Login = async (req, res) => {
  try {
    logger.info('[LoginUser] => login process started')
    const userFromRequest = req.body

    const user = await UserModel.findOne({
      email: userFromRequest.email,
    });
  
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      }) 
    }
  
    const validPassword = await user.isValidPassword(userFromRequest.password)

    if (!validPassword) {
      return res.status(422).json({
        message: 'Email or password is not correct',
      }) 
    }
  
    const token = await jwt.sign({ email: user.email, _id: user._id}, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' })

    logger.info('[LoginUser] => login process done')
    return res.status(200).json({
      message: 'Login successful',
      user,
      token
    })
  } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        message: 'Server Error',
        data: null
      })
  }
}


module.exports = {
  CreateUser,
  Login
}