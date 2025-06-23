// src/features/auth/LoginForm.tsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Alert, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const from = (location.state as LocationState)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const result = await login(values);
      if (result.type === 'auth/login/fulfilled') {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    navigate('/forgot-password');
  };

  return (
    <div>
      <Title level={2}>Sign In</Title>
      <Text type="secondary">Welcome back! Please sign in to your account.</Text>
      
      {error && (
        <Alert
          message="Login Failed"
          description={error}
          type="error"
          showIcon
          closable
          onClose={clearError}
          style={{ marginTop: 16, marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            block
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button 
          type="link" 
          onClick={handleForgotPassword}
          style={{ padding: 0 }}
        >
          Forgot your password?
        </Button>
      </div>

      <Divider>Don't have an account?</Divider>
      
      <div style={{ textAlign: 'center' }}>
        <Text>
          New to our platform?{' '}
          <Link to="/register">
            Create an account
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default LoginForm;