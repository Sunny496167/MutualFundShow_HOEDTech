// src/components/PageSpinner.tsx
import React from 'react';
import { Spin } from 'antd';

interface PageSpinnerProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
}

const PageSpinner: React.FC<PageSpinnerProps> = ({ 
  tip = 'Loading...', 
  size = 'large' 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100%'
    }}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default PageSpinner;