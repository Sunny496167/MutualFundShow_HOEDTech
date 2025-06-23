// src/pages/LoginPage.tsx
import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../features/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;