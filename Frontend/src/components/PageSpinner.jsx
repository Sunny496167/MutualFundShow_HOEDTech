// src/components/PageSpinner.jsx
import React from 'react';
import { Spin } from 'antd';

const PageSpinner = ({ 
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