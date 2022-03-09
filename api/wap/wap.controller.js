const wapService = require('./wap.service.js');
const logger = require('../../services/logger.service');


// Get List
async function getWaps(req, res) {
  try {
    const { user } = req.session;
    const filterBy = { createdBy: { _id: user._id, nickname: user.nickname } };

    const waps = await wapService.query(filterBy);
    res.json(waps);
  } catch (err) {
    logger.error('Failed to get waps', err);
    res.status(500).send({ err: 'Failed to get waps' });
  }
}

// Get by id 
async function getWapById(req, res) {
  try {
    const { wapId } = req.params;
    const wap = await wapService.getById(wapId);
    res.json(wap);
  } catch (err) {
    logger.error('Failed to get wap', err);
    res.status(500).send({ err: 'Failed to get wap' });
  }
}

// Remove by id
async function removeWap(req, res) {
  try {
    const { wapId } = req.params;
    await wapService.remove(wapId);
    res.end();
  } catch (err) {
    logger.error('Failed to remove wap', err);
    res.status(500).send({ err: 'Failed to remove wap' });
  }
}

// Add
async function addWap(req, res) {
  try {
    const wapToAdd = req.body;
    let { user } = req.session;

    const addedWap = await wapService.add(wapToAdd, user);
    res.json(addedWap);
  } catch (err) {
    logger.error('Failed to add wap', err);
    res.status(500).send({ err: 'Failed to add wap' });
  }
}

// Update
async function updateWap(req, res) {
  try {
    const wapToUpdate = req.body;
    const updatedWap = await wapService.update(wapToUpdate);
    res.json(updatedWap);
  } catch (err) {
    logger.error('Failed to update wap', err);
    res.status(500).send({ err: 'Failed to update wap' });
  }
}


module.exports = {
  getWaps,
  getWapById,
  addWap,
  updateWap,
  removeWap
}