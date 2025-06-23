// src/pages/RegisterPage.jsx
import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../features/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;