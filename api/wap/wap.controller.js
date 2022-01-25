const wapService = require('./wap.service.js');
const logger = require('../../services/logger.service');


// Get List
async function getWaps(req, res) {
  try {
    // *OLD - console.log(JSON.parse(req.query.filterBy)) // filterBy comes as a json string from the frontend service IF we dont use app.use(express.json())
    // *NEW - const filterBy = req.query;
    // *CASE SPECIFIC - here we could just send the id string - const { createdById } = req.query;
    // const filterBy = req.query; // if we didnt send anything on params, filterBy will just be an empty object like this : {}
    // console.log('filterBy:', filterBy)

    const { user } = req.session;
    // console.log('user:', user)
    const filterBy = { createdBy: { _id: user._id, nickname: user.nickname } };
    // console.log('filterBy:', filterBy);

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
    const wapId = req.params.wapId;
    const wap = await wapService.getById(wapId);
    res.json(wap); // like res.send(wap) OR res.send(JSON.stringify(wap)) if we wouldn't use json in our express app.
  } catch (err) {
    logger.error('Failed to get wap', err);
    res.status(500).send({ err: 'Failed to get wap' });
  }
}

// Remove by id
async function removeWap(req, res) {
  try {
    const wapId = req.params.wapId;
    const removedId = await wapService.remove(wapId);
    res.send(removedId);
  } catch (err) {
    logger.error('Failed to remove wap', err);
    res.status(500).send({ err: 'Failed to remove wap' });
  }
}

// Add
async function addWap(req, res) {
  try {
    const wapToAdd = req.body;
    const { user } = req.session;
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