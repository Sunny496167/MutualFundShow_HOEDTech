// src/features/auth/RegisterForm.jsx
import React, { useEffect } from 'react';
import { Form, Input, Button, Alert, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { 
    register, 
    isLoading, 
    error, 
    registrationSuccess, 
    clearError, 
    clearRegistrationSuccess 
  } = useAuth();

  useEffect(() => {
    if (registrationSuccess) {
      form.resetFields();
      // Navigate to login after successful registration
      setTimeout(() => {
        clearRegistrationSuccess();
        navigate('/login');
      }, 3000);
    }
  }, [registrationSuccess, navigate, form, clearRegistrationSuccess]);

  useEffect(() => {
    return () => {
      clearError();
      clearRegistrationSuccess();
    };
  }, [clearError, clearRegistrationSuccess]);

  const handleSubmit = async (values) => {
    try {
      await register(values);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  if (registrationSuccess) {
    return (
      <div>
        <Alert
          message="Registration Successful!"
          description="Please check your email to verify your account. You will be redirected to the login page shortly."
          type="success"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Create Account</Title>
      <Text type="secondary">Join us today! Create your account to get started.</Text>
      
      {error && (
        <Alert
          message="Registration Failed"
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
        name="register"
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: 'Please enter your full name!' },
            { min: 2, message: 'Name must be at least 2 characters!' },
            { max: 50, message: 'Name cannot exceed 50 characters!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Enter your full name"
          />
        </Form.Item>

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
            { min: 6, message: 'Password must be at least 6 characters!' },
            { 
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
            }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Confirm your password"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            block
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <Divider>Already have an account?</Divider>
      
      <div style={{ textAlign: 'center' }}>
        <Text>
          Already registered?{' '}
          <Link to="/login">
            Sign in here
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default RegisterForm;