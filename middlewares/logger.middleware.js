const logger = require('../services/logger.service');

async function log(req, res, next) {
  logger.info('Requested For Data');
  if (req.session && req.session.user) {
    logger.info('Req from: ' + req.session.user.nickname);
  }
  next();
}

module.exports = {
  log
}
