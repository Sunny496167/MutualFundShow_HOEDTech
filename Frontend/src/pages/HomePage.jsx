// src/pages/HomePage.tsx
import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import MainLayout from '../layouts/MainLayout';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <Title level={1}>Welcome to Mutual Funds App</Title>
        <Paragraph>
          Discover and manage your mutual fund investments with ease.
        </Paragraph>
        
        <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
          <Col xs={24} sm={12} md={8}>
            <Card title="Search Funds" hoverable>
              <Paragraph>
                Search through thousands of mutual funds to find the perfect investment for your portfolio.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Track Performance" hoverable>
              <Paragraph>
                Monitor your saved funds and track their performance over time with detailed analytics.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Save Favorites" hoverable>
              <Paragraph>
                Save your favorite mutual funds and create a personalized watchlist for easy access.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default HomePage;