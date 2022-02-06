const express = require('express');
const router = express.Router(); // router allows us to use middlewares & get req,res,next from each function

const { requireAuth } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const { getWaps, getWapById, removeWap, updateWap, addWap } = require('./wap.controller');

// middleware that is specific to this router
// router.use(requireAuth)

// Get list
router.get('/', log, getWaps);
// Get by id
router.get('/:wapId', getWapById);
// Remove by id
router.delete('/:wapId', requireAuth, removeWap);
// Update existing
router.put('/:wapId', requireAuth, updateWap);
// Add new
router.post('/', addWap);


module.exports = router;