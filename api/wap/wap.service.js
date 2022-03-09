const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;


// Get list
// Filter by user id
// filterBy will look like this : { createdBy: { _id: "5j32h5kjdar", nickname: "joe" } }
async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy);
        const collection = await dbService.getCollection('wap');
        const waps = await collection.find(criteria).toArray();
        return waps;
    } catch (err) {
        logger.error('cannot find waps', err);
        throw err;
    }
}

// Get by ID
async function getById(wapId) {
    try {
        const collection = await dbService.getCollection('wap');
        const wap = collection.findOne({ '_id': ObjectId(wapId) });
        return wap;
    } catch (err) {
        logger.error(`while finding wap ${wapId}`, err);
        throw err;
    }
}

// Remove by ID
async function remove(wapId) {
    try {
        const collection = await dbService.getCollection('wap');
        await collection.deleteOne({ '_id': ObjectId(wapId) });
        logger.info(`Deleted successfully (wap id : ${wapId})`);
    } catch (err) {
        logger.error(`cannot remove wap ${wapId}`, err);
        throw err;
    }
}

// Add new
async function add(wapToAdd, user) {
    try {
        wapToAdd.createdBy = user ? { _id: user._id, nickname: user.nickname } : { nickname: 'Guest' };
        const collection = await dbService.getCollection('wap');
        const addedWap = await collection.insertOne(wapToAdd);
        return addedWap.ops[0]; // addedWap returns as an object from mongo, the real wap object we need sits inside the "ops" key at index 0.
    } catch (err) {
        logger.error('cannot insert wap', err);
        throw err;
    }
}

// Update existing
async function update(wapToUpdate) {
    try {
        const id = ObjectId(wapToUpdate._id);
        delete wapToUpdate._id;
        const collection = await dbService.getCollection('wap');
        await collection.updateOne({ "_id": id }, { $set: { ...wapToUpdate } });
        wapToUpdate._id = id;
        return wapToUpdate;
    } catch (err) {
        logger.error(`cannot update wap ${wapId}`, err);
        throw err;
    }
}


module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}

// ****************************************************************

function _buildCriteria(filterBy) {
    const criteria = {};

    if (filterBy.createdBy) criteria.createdBy = filterBy.createdBy;

    return criteria;
}