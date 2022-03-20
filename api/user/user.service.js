const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;


async function query() {

    try {
        const collection = await dbService.getCollection('user');
        let users = await collection.find(criteria).toArray();
        users = users.map(user => {
            delete user.password
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err);
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            nickname: user.nickname,
        }
        const collection = await dbService.getCollection('user');

        const userInCollection = await collection.findOne({ 'username': user.username });
        if (userInCollection) {
            logger.error(`Signup attempt with an existing username - ${userInCollection.username}`);
            return Promise.reject();
        }

        await collection.insertOne(userToAdd);
        return userToAdd;
    } catch (err) {
        logger.error('cannot insert user', err);
        throw err;
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


module.exports = {
    query,
    add,
    remove,
    update,
    getByUsername
}