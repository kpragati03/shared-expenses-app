const prisma = require('../config/prisma');

class AuthRepository {
  async findUserByEmail(email) {
    return prisma.user.findFirst({
      where: { 
        email,
        deletedAt: null 
      },
    });
  }

  async findUserWithPasswordByEmail(email) {
    return prisma.user.findFirst({
      where: { 
        email,
        deletedAt: null
      },
    });
  }

  async createUser(userData) {
    return prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        defaultCurrency: userData.defaultCurrency || 'INR',
      },
      select: {
        id: true,
        name: true,
        email: true,
        defaultCurrency: true,
        createdAt: true,
      },
    });
  }
}

module.exports = new AuthRepository();