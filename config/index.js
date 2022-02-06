let config;

// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === 'production') {
  // In production - return the prod set of keys
  config = require('./prod');
} else {
  // In development - return the dev keys
  config = require('./dev');
}

module.exports = config;