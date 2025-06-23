const axios = require('axios');
const { NotFoundError, BadRequestError, InternalServerError  } = require('../Utils/errors');

//search mutual funds by query
const searchMutualFunds = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        throw new BadRequestError('Query parameter is required');
    }
    try {
        const response = await axios.get(`https://api.mfapi.in/mf/search?q=${query}`);
        res.status(200).json(response.data);
        console.log(response.data);
    }
    catch (error) {
        throw new InternalServerError('Failed to fetch mutual funds data');
    }
}

// get mutual funds details by id
const getMutualFundsDetails = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError('ID parameter is required');
    }
    try {
        const response = await axios.get(`https://api.mfapi.in/mf/${id}`);
        if (response.data.length === 0) {
            throw new NotFoundError('Mutual fund not found');
        }
        res.status(200).json(response.data);
        console.log(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new NotFoundError('Mutual fund not found');
        } else {
            throw new InternalServerError('Failed to fetch mutual fund details');
        }
    }
}

module.exports = {
    searchMutualFunds,
    getMutualFundsDetails
};