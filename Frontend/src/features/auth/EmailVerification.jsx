// src/features/auth/EmailVerification.jsx
import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const EmailVerification = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const { verifyEmail, error } = useAuth();

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.type === 'auth/verifyEmail/fulfilled') {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (err) {
        console.error('Email verification error:', err);
        setVerificationStatus('error');
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail]);

  if (verificationStatus === 'loading') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, fontSize: '16px' }}>
          Verifying your email...
        </p>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          status="success"
          title="Email Verified Successfully!"
          subTitle="Your email has been verified. You can now login to your account."
          extra={
            <Button type="primary" size="large">
              <Link to="/login">
                Go to Login
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        status="error"
        title="Email Verification Failed"
        subTitle={
          <div>
            <p>
              {error || 'The verification link is invalid or has expired.'}
            </p>
            <Alert
              message="What you can do:"
              description={
                <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                  <li>Check if you clicked the correct link from your email</li>
                  <li>Request a new verification email from the login page</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        }
        extra={[
          <Button type="primary" key="login">
            <Link to="/login">
              Go to Login
            </Link>
          </Button>,
          <Button key="register">
            <Link to="/register">
              Create New Account
            </Link>
          </Button>
        ]}
      />
    </div>
  );
};

export default EmailVerification;