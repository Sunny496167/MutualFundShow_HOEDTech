// src/features/auth/ResetPasswordForm.tsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Alert, Typography, Result } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const ResetPasswordForm: React.FC = () => {
  const [form] = Form.useForm();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [resetSuccess, setResetSuccess] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (values: { password: string }) => {
    if (!token) return;
    
    try {
      const result = await resetPassword(token, values.password);
      if (result.type === 'auth/resetPassword/fulfilled') {
        setResetSuccess(true);
        form.resetFields();
      }
    } catch (err) {
      console.error('Password reset error:', err);
    }
  };

  if (resetSuccess) {
    return (
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        status="success"
        title="Password Reset Successful!"
        subTitle="Your password has been successfully reset. You can now login with your new password."
        extra={
          <Button type="primary">
            <Link to="/login">
              Go to Login
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Title level={2}>Reset Password</Title>
      <Text type="secondary">
        Enter your new password below.
      </Text>
      
      {error && (
        <Alert
          message="Password Reset Failed"
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
        name="resetPassword"
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter your new password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
            { 
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
            }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Enter your new password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
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
            placeholder="Confirm your new password"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            block
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;