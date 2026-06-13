const prisma = require('../config/prisma');

class GroupRepository {
  async createGroup(data) {
    return prisma.group.create({
      data: {
        name: data.name,
        baseCurrency: data.baseCurrency || 'INR',
      },
    });
  }

  async addMember(groupId, userId) {
    return prisma.groupMember.create({
      data: {
        groupId,
        userId,
      },
    });
  }

  async findGroupById(id) {
    return prisma.group.findFirst({
      where: { id, deletedAt: null },
      include: { members: { include: { user: true } } },
    });
  }
}

module.exports = new GroupRepository();