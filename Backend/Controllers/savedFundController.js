//savedFundController.js
const SavedFund = require('../Models/SavedFunds');
const { NotFoundError, BadRequestError, InternalServerError } = require('../Utils/errors');


// get all saved funds 
const getSavedFunds = async (req, res) => {
    try {
        const savedFunds = await SavedFund.find({ userId: req.user.userId });

        res.status(200).json({
            success: true,
            count: savedFunds.length,
            data: savedFunds
        });
    } catch (error) {
        console.error('Error fetching saved funds:', error);
        throw new InternalServerError('Failed to fetch saved funds');
    }
};

// save a new fund
const saveFund = async (req, res) => {
  try {
    const { schemeName, schemeCode, fundType, category, amc, notes } = req.body;

    // Validate required fields
    if (!schemeName || !schemeCode || !fundType || !category || !amc) {
      throw new BadRequestError('All fund details are required.');
    }

    // Optional: check if already saved
    const existingFund = await SavedFund.findOne({
      userId: req.user.userId,
      schemeCode
    });

    if (existingFund) {
      throw new BadRequestError('Fund already saved.');
    }

    const newFund = await SavedFund.create({
      userId: req.user.userId,
      schemeName,
      schemeCode,
      fundType,
      category,
      amc,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Fund saved successfully',
      data: newFund
    });
  } catch (error) {
    console.error('Error saving fund:', error);
    if (error instanceof BadRequestError) throw error;
    throw new InternalServerError('Failed to save fund');
  }
};

// delete a saved fund
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

// get saved fund details by id
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
