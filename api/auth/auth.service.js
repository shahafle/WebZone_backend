const userService = require('../user/user.service');
const logger = require('../../services/logger.service');
const bcrypt = require('bcrypt');


async function signup(username, password, nickname) {
    const saltRounds = 10;

    logger.debug(`auth.service - signup with username: ${username}, nickname: ${nickname}`);

    if (!username || !password || !nickname) return Promise.reject('username, password and nickname are required!');

    const hash = await bcrypt.hash(password, saltRounds);
    return userService.add({ username, password: hash, nickname });
}

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`);

    const user = await userService.getByUsername(username);
    if (!user) return Promise.reject('Invalid username or password');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return Promise.reject('Invalid username or password');

    delete user.password;
    return user;
}

async function checkIsAvailable(username) {
    const user = await userService.getByUsername(username);
    // We return the opposite value because if it DOES exist, it is NOT available.
    return !user;
}

module.exports = {
    signup,
    login,
    checkIsAvailable
}