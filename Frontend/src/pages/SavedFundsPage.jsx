import React from 'react'
import AuthLayout from '../layouts/AuthLayout'
import SavedFundsList from '../features/savedFunds/SavedFundsList'

const SavedFundsPage = () => {
  return (
    <AuthLayout>
      <SavedFundsList />
    </AuthLayout>
  )
}

export default SavedFundsPage