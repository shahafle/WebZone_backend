const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');


async function add(user) {
    try {
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


module.exports = {
    add
}