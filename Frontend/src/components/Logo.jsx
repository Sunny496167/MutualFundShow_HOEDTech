// src/components/Logo.jsx
import React from 'react';
import { Typography } from 'antd';
import { FundOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Logo = ({ collapsed = false }) => {
  if (collapsed) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff'
      }}>
        <FundOutlined style={{ fontSize: '24px' }} />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      color: '#fff'
    }}>
      <FundOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
      <Title 
        level={4} 
        style={{ 
          color: '#fff', 
          margin: 0,
          fontWeight: 'bold'
        }}
      >
        MutualFunds
      </Title>
    </div>
  );
};

export default Logo;