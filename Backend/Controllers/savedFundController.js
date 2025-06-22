//savedFundController.js
const SavedFund = require('../Models/SavedFunds');
const { NotFoundError, BadRequestError, InternalServerError } = require('../Utils/errors');

const getSavedFunds = async (req, res) => {
    try{
        const savedFunds = await SavedFund.find();
        if (!savedFunds || savedFunds.length === 0) {
            throw new NotFoundError('No saved funds found');
        }
        res.status(200).json(savedFunds);
    }
    catch (error) {
        throw new InternalServerError('Failed to fetch saved funds');
    }
}

const saveFund = async (req, res) => {
    const { fundName, fundId, amount } = req.body;
    if (!fundName || !fundId || !amount) {
        throw new BadRequestError('Fund name, ID, and amount are required');
    }
    try {
        const newSavedFund = new SavedFund({ fundName, fundId, amount });
        await newSavedFund.save();
        res.status(201).json(newSavedFund);
    } catch (error) {
        throw new InternalServerError('Failed to save fund');
    }
}

const deleteSavedFund = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError('ID parameter is required');
    }
    try {
        const deletedFund = await SavedFund.findByIdAndDelete(id);
        if (!deletedFund) {
            throw new NotFoundError('Saved fund not found');
        }
        res.status(200).json({ message: 'Saved fund deleted successfully' });
    } catch (error) {
        throw new InternalServerError('Failed to delete saved fund');
    }
}

const getSavedFundById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError('ID parameter is required');
    }
    try {
        const savedFund = await SavedFund.findById(id);
        if (!savedFund) {
            throw new NotFoundError('Saved fund not found');
        }
        res.status(200).json(savedFund);
    } catch (error) {
        throw new InternalServerError('Failed to fetch saved fund details');
    }
}

module.exports = {
    getSavedFunds,
    saveFund,
    deleteSavedFund,
    getSavedFundById
};
