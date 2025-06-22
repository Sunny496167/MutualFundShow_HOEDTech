const express = require('express');
const { getSavedFunds, saveFund, deleteSavedFund, getSavedFundById } = require('../Controllers/savedFundController');
const router = express.Router();

router.get('/', getSavedFunds);
router.post('/save', saveFund);
router.delete('/:id', deleteSavedFund);
router.get('/:id', getSavedFundById);

module.exports = router;