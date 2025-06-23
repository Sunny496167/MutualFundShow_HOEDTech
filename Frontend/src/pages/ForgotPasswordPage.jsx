// src/pages/ForgotPasswordPage.tsx
import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import ForgotPasswordForm from '../features/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;