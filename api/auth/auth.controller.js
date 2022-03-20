const authService = require('./auth.service')
const logger = require('../../services/logger.service')


async function signup(req, res) {
    try {
        const { username, password, nickname } = req.body;
        const account = await authService.signup(username, password, nickname);
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account));
        
        const user = await authService.login(username, password);
        req.session.user = user;
        res.json(user);
    } catch (err) {
        logger.error('Failed to signup ' + err);
        res.status(500).send({ err: 'Failed to signup' });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await authService.login(username, password);
        req.session.user = user;
        res.json(user);
    } catch (err) {
        logger.error('Failed to Login ' + err);
        res.status(401).send({ err: 'Failed to Login' });
    }
}

async function logout(req, res) {
    try {
        req.session.destroy();
        res.send({ msg: 'Logged out successfully' });
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' });
    }
}

async function checkIsAvailable(req, res) {
    try {
        const { username } = req.body;
        const isAvailable = await authService.checkIsAvailable(username);
        res.send(isAvailable);
    } catch (err) {

    }
}


module.exports = {
    signup,
    login,
    logout,
    checkIsAvailable
}