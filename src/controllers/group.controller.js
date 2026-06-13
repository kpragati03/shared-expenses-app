const groupService = require('../services/group.service');
const balanceService = require('../services/balance.service');

class GroupController {
  async create(req, res, next) {
    try {
      const group = await groupService.createGroup(req.body, req.user.id);
      res.status(201).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const group = await groupService.getGroupDetails(req.params.id);
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  // Dashboard logic add kiya yahan
  async getGroupDashboard(req, res, next) {
    try {
      const { id } = req.params;
      const balances = await balanceService.getGroupBalances(id);
      
      res.status(200).json({
        success: true,
        groupId: id,
        balances: balances
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GroupController();