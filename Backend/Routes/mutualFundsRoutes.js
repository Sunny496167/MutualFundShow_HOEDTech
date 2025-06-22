const express = require('express');
const { searchMutualFunds, getMutualFundsDetails } = require('../Controllers/mutualFundController');
const router = express.Router();

router.get('/search', searchMutualFunds);
router.get('/:id', getMutualFundsDetails);

module.exports = router;