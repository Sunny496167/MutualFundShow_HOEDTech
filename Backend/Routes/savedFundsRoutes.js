const express = require('express');
const { getSavedFunds, saveFund, deleteSavedFund, getSavedFundById } = require('../Controllers/savedFundController');
const { authenticateUser } = require('../Middlewares/authMiddlewares');
const router = express.Router();

router.get('/', authenticateUser, getSavedFunds);
router.post('/save', authenticateUser, saveFund);
router.delete('/:id', authenticateUser, deleteSavedFund);
router.get('/:id', authenticateUser, getSavedFundById);

module.exports = router;