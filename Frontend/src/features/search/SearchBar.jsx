// src/components/SearchBar.js - Fixed version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, DollarSign, TrendingUp, TrendingDown, AlertCircle, X } from 'lucide-react';
import { searchFunds, setQuery, clearSearch, clearError } from '../features/search/searchSlice';

const SearchBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use actual Redux state instead of mock
  const { query, results, loading, error, hasSearched } = useSelector(state => state.search);
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const handleSearch = async (e) => {
    // Prevent form submission if this is in a form
    if (e) {
      e.preventDefault();
    }
    
    if (searchValue.trim()) {
      dispatch(setQuery(searchValue.trim()));
      dispatch(searchFunds(searchValue.trim()));
    }
  };

  const handleInputChange = (value) => {
    setSearchValue(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleSearch();
    }
  };

  const handleFundClick = (fundId) => {
    // Use navigate instead of direct assignment
    navigate(`/fund/${fundId}`);
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
    setSearchValue('');
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatAUM = (aum) => {
    if (aum >= 10000000000) {
      return `₹${(aum / 10000000000).toFixed(1)} K Cr`;
    } else if (aum >= 1000000000) {
      return `₹${(aum / 1000000000).toFixed(1)} Cr`;
    } else if (aum >= 10000000) {
      return `₹${(aum / 10000000).toFixed(1)} Cr`;
    } else if (aum >= 100000) {
      return `₹${(aum / 100000).toFixed(1)} L`;
    }
    return formatCurrency(aum);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'very high': return 'bg-red-200 text-red-900 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReturnIcon = (returnValue) => {
    return returnValue >= 0 ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getReturnColor = (returnValue) => {
    return returnValue >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        {/* Wrap in form to handle Enter key properly */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search mutual funds..."
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={loading || !searchValue.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Search Error</h4>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleClearError}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Card */}
      {hasSearched && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results ({results.length})
              </h2>
              {results.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Clear Results
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No mutual funds found
                </h3>
                <p className="text-gray-600">
                  Try searching with different keywords or fund names
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((fund) => (
                  <div
                    key={fund.id}
                    onClick={() => handleFundClick(fund.id)}
                    className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all bg-gray-50 hover:bg-white"
                  >
                    {/* Fund Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {fund.name}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200">
                            {fund.category}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Fund Manager: {fund.fundManager} | Expense Ratio: {fund.expenseRatio}%
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            NAV: {formatCurrency(fund.nav)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          AUM: {formatAUM(fund.aum)}
                        </p>
                      </div>
                    </div>

                    {/* Returns and Risk */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          {getReturnIcon(fund.returns1Y)}
                          <span className="text-sm text-gray-600">1Y:</span>
                          <span className={`font-medium ${getReturnColor(fund.returns1Y)}`}>
                            {fund.returns1Y}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getReturnIcon(fund.returns3Y)}
                          <span className="text-sm text-gray-600">3Y:</span>
                          <span className={`font-medium ${getReturnColor(fund.returns3Y)}`}>
                            {fund.returns3Y}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getReturnIcon(fund.returns5Y)}
                          <span className="text-sm text-gray-600">5Y:</span>
                          <span className={`font-medium ${getReturnColor(fund.returns5Y)}`}>
                            {fund.returns5Y}%
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getRiskColor(fund.riskLevel)}`}>
                        {fund.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;