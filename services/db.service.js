const MongoClient = require('mongodb').MongoClient;
<<<<<<< HEAD


module.exports = {
    getCollection
}

// Database Name
const dbName = 'task_db';

// Database Connection
var dbConn = null;
=======
const config = require('../config');

// Database Config
const dbName = 'wap_db';
let dbConn = null;
>>>>>>> 7f2a012f2924ff798980a2df4acc3928138906b9

async function getCollection(collectionName) {
    try {
        const db = await connect();
        const collection = await db.collection(collectionName);
        return collection;
    } catch (err) {
        logger.error('Failed to get Mongo collection', err);
        throw err;
    }
}

async function connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        dbConn = db;
        return db;
    } catch (err) {
        logger.error('Cannot Connect to DB', err);
        throw err;
    }
}


module.exports = {
    getCollection
}