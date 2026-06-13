const groupRepository = require('../repositories/group.repository');

class GroupService {
  async createGroup(groupData, creatorId) {
    const group = await groupRepository.createGroup(groupData);
    // Automatically add the creator as a member
    await groupRepository.addMember(group.id, creatorId);
    return group;
  }

  async getGroupDetails(groupId) {
    const group = await groupRepository.findGroupById(groupId);
    if (!group) throw new Error('Group not found');
    return group;
  }
}

module.exports = new GroupService();
