// src/features/auth/ForgotPasswordForm.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const ForgotPasswordForm = () => {
  const [form] = Form.useForm();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { requestPasswordReset, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (values) => {
    try {
      const result = await requestPasswordReset(values.email);
      if (result.type === 'auth/requestPasswordReset/fulfilled') {
        setSubmittedEmail(values.email);
        setEmailSent(true);
        form.resetFields();
      }
    } catch (err) {
      console.error('Password reset request error:', err);
    }
  };

  if (emailSent) {
    return (
      <Result
        status="success"
        title="Reset Email Sent!"
        subTitle={
          <div>
            <Text>
              We've sent a password reset link to <strong>{submittedEmail}</strong>
            </Text>
            <br />
            <Text type="secondary">
              Please check your email and follow the instructions to reset your password.
            </Text>
          </div>
        }
        extra={[
          <Button type="primary" key="back-to-login">
            <Link to="/login">
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </Button>,
          <Button 
            key="resend" 
            onClick={() => setEmailSent(false)}
          >
            Resend Email
          </Button>
        ]}
      />
    );
  }

  return (
    <div>
      <Title level={2}>Forgot Password?</Title>
      <Text type="secondary">
        Enter your email address and we'll send you a link to reset your password.
      </Text>
      
      {error && (
        <Alert
          message="Error"
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
        name="forgotPassword"
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Enter your email address"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            block
          >
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/login">
          <ArrowLeftOutlined /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;