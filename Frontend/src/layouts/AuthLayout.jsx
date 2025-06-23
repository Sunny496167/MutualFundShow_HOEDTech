// src/layouts/AuthLayout.tsx
import React from 'react';
import { Layout, Card, Row, Col } from 'antd';
import Logo from '../components/Logo';

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '50px 0' }}>
        <Row justify="center" align="middle" style={{ minHeight: '100%' }}>
          <Col xs={22} sm={16} md={12} lg={8} xl={6}>
            <Card
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Logo />
              </div>
              {children}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AuthLayout;