// src/pages/RegisterPage.tsx
import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../features/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;