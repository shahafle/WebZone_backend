
const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;


async function query(filterBy = {}) {

    const criteria = _buildCriteria(filterBy);

    try {
        const collection = await dbService.getCollection('user');
        let users = await collection.find(criteria).toArray();
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp();
            // Returning fake data :
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err);
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ '_id': ObjectId(userId) });
        delete user.password;
        return user;
    } catch (err) {
        logger.error(`while finding user ${userId}`, err);
        throw err;
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ username });
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err);
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user');
        await collection.deleteOne({ '_id': ObjectId(userId) });
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err);
        throw err;
    }
}

async function update(user) {
    try {
        // peek only updatable fields!
        const userToUpdate = {
            _id: ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            score: user.score
        }
        const collection = await dbService.getCollection('user');
        await collection.updateOne({ '_id': userToUpdate._id }, { $set: userToUpdate }); // $set updates ONLY the keys we sent on userToUpdate
        return userToUpdate;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            nickname: user.nickname,
        }
        const collection = await dbService.getCollection('user');

        const userInCollection = await collection.findOne({ 'username': user.username });
        if (userInCollection) return userInCollection;

        await collection.insertOne(userToAdd);
        return userToAdd;
    } catch (err) {
        logger.error('cannot insert user', err);
        throw err;
    }
}

function _buildCriteria(filterBy) {

    const criteria = {};

    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' };
        // $or = if matches to one of the keys
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}


module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}