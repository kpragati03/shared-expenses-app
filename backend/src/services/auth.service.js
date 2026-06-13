const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async registerUser(userData) {
    const { name, email, password, defaultCurrency } = userData;

    // 1. Check if user already exists
    const userExists = await authRepository.findUserByEmail(email);
    if (userExists) {
      const error = new Error('User already exists with this email');
      error.status = 400;
      throw error;
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in database
    const newUser = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      defaultCurrency,
    });

    // 4. Generate JWT
    const token = generateToken(newUser.id);

    return {
      user: newUser,
      token,
    };
  }

  async loginUser(credentials) {
    const { email, password } = credentials;

    // 1. Find user by email
    const user = await authRepository.findUserWithPasswordByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // 2. Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    // 3. Generate JWT
    const token = generateToken(user.id);

    // 4. Remove password from response
    delete user.password;
    delete user.deletedAt;
    delete user.deletedById;

    return {
      user,
      token,
    };
  }
}

module.exports = new AuthService();