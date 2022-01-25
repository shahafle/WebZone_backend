const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const logger = require('../../services/logger.service');


// Get list
// Filter by user id
// filterBy will look something like this : { createdBy: { _id: "blabla123", nickname: "momo" } }
async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy);
        // const criteria = {};
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
        return wapId;
    } catch (err) {
        logger.error(`cannot remove wap ${wapId}`, err);
        throw err;
    }
}

// Add new
async function add(wapToAdd, user) {
    try {
        wapToAdd.createdBy = { _id: user._id, nickname: user.nickname };
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

    // console.log(criteria);

    // should look like this :
    // criteria = {
    //     createdBy: {
    //         _id: "laksdfjl132k5jalkfsd",
    //         nickname: "momo"
    //     }
    // }

    return criteria;
}