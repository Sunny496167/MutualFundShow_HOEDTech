// src/pages/ResetPasswordPage.tsx
import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import ResetPasswordForm from '../features/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;