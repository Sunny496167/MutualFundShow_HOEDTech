// src/features/fundDetails/FundDetails.jsx
import React, { useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Alert,
  message,
  Divider
} from 'antd';
import { 
  StarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  TrophyOutlined,
  PercentageOutlined,
  BankOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchFundDetails, saveFundToWatchlist, clearErrors } from './fundDetailsSlice';
import PageSpinner from '../../components/PageSpinner';

const { Title, Text, Paragraph } = Typography;

const FundDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { 
    currentFund, 
    loading, 
    error, 
    saving, 
    saveError,
    saveSuccess 
  } = useAppSelector(state => state.fundDetails);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  // Fetch fund details on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchFundDetails(id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);

  // Handle save success/error messages
  useEffect(() => {
    if (saveError) {
      message.error(saveError);
      dispatch(clearErrors());
    }
    
    if (saveSuccess) {
      message.success('Fund saved to your watchlist successfully!');
      dispatch(clearErrors());
    }
  }, [saveError, saveSuccess, dispatch]);

  // Handle save fund to watchlist
  const handleSaveFund = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to save funds to watchlist');
      navigate('/login');
      return;
    }

    if (!currentFund) {
      message.error('Fund data not available');
      return;
    }

    try {
      await dispatch(saveFundToWatchlist(currentFund)).unwrap();
    } catch (error) {
      // Error handling is done in useEffect above
      console.error('Failed to save fund:', error);
    }
  };

  // Utility functions
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatAUM = (aum) => {
    if (!aum && aum !== 0) return 'N/A';
    
    if (aum >= 10000000) {
      return `₹${(aum / 10000000).toFixed(1)} Cr`;
    } else if (aum >= 100000) {
      return `₹${(aum / 100000).toFixed(1)} L`;
    }
    return formatCurrency(aum);
  };

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return 'default';
    
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'green';
      case 'moderate': return 'orange';
      case 'moderately low': return 'geekblue';
      case 'moderately high': return 'gold';
      case 'high': return 'red';
      case 'very high': return 'volcano';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getReturnColor = (returnValue) => {
    if (returnValue === null || returnValue === undefined) return '#666';
    return returnValue >= 0 ? '#52c41a' : '#f5222d';
  };

  const getReturnIcon = (returnValue) => {
    if (returnValue === null || returnValue === undefined) return null;
    return returnValue >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  const formatReturn = (returnValue) => {
    if (returnValue === null || returnValue === undefined) return 'N/A';
    return returnValue.toFixed(2);
  };

  // Loading state
  if (loading) {
    return <PageSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <Alert
          message="Error Loading Fund Details"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => dispatch(fetchFundDetails(id))}>
                Retry
              </Button>
              <Button size="small" danger onClick={() => navigate('/')}>
                Go Back
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  // Fund not found state
  if (!currentFund) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <Alert
          message="Fund Not Found"
          description="The requested mutual fund could not be found."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/')}>
              Go Back to Search
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Fund Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <Space direction="vertical" size="small">
              <Title level={2} style={{ margin: 0, wordBreak: 'break-word' }}>
                {currentFund.name || currentFund.schemeName || 'Unknown Fund'}
              </Title>
              <Space wrap>
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                  {currentFund.category || 'Other'}
                </Tag>
                <Tag 
                  color={getRiskColor(currentFund.riskLevel)} 
                  style={{ fontSize: 14, padding: '4px 12px' }}
                >
                  {currentFund.riskLevel ? `${currentFund.riskLevel} Risk` : 'Risk N/A'}
                </Tag>
              </Space>
            </Space>
          </div>
          
          <Space wrap>
            <Button 
              type="primary" 
              icon={<HeartOutlined />}
              loading={saving}
              onClick={handleSaveFund}
              size="large"
              disabled={!isAuthenticated}
            >
              {saving ? 'Saving...' : 'Save to Watchlist'}
            </Button>
            <Button onClick={() => navigate(-1)} size="large">
              Back
            </Button>
          </Space>
        </div>

        {/* NAV and Key Metrics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Current NAV"
              value={currentFund.nav || 0}
              prefix="₹"
              precision={2}
              valueStyle={{ color: '#1890ff', fontSize: 24 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="AUM"
              value={formatAUM(currentFund.aum)}
              prefix={<BankOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Expense Ratio"
              value={currentFund.expenseRatio || 0}
              suffix="%"
              prefix={<PercentageOutlined />}
              precision={2}
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                <CalendarOutlined /> Launch Date
              </Text>
              <Text strong style={{ fontSize: 16 }}>
                {formatDate(currentFund.launchDate)}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Returns Performance */}
      <Card title={<><TrophyOutlined /> Returns Performance</>} style={{ marginBottom: 24 }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="1 Year Returns"
              value={formatReturn(currentFund.returns1Y)}
              suffix="%"
              valueStyle={{ 
                color: getReturnColor(currentFund.returns1Y),
                fontSize: 24
              }}
              prefix={getReturnIcon(currentFund.returns1Y)}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="3 Year Returns"
              value={formatReturn(currentFund.returns3Y)}
              suffix="%"
              valueStyle={{ 
                color: getReturnColor(currentFund.returns3Y),
                fontSize: 24
              }}
              prefix={getReturnIcon(currentFund.returns3Y)}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="5 Year Returns"
              value={formatReturn(currentFund.returns5Y)}
              suffix="%"
              valueStyle={{ 
                color: getReturnColor(currentFund.returns5Y),
                fontSize: 24
              }}
              prefix={getReturnIcon(currentFund.returns5Y)}
            />
          </Col>
        </Row>
      </Card>

      {/* Fund Details */}
      <Card title="Fund Details" style={{ marginBottom: 24 }}>
        <Descriptions 
          bordered 
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          size="middle"
        >
          <Descriptions.Item 
            label={<><UserOutlined /> Fund Manager</>}
            span={1}
          >
            <Text strong>{currentFund.fundManager || 'N/A'}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<><BankOutlined /> Fund House</>}
            span={1}
          >
            <Text strong>{currentFund.amc || currentFund.fundHouse || 'N/A'}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="Fund Category"
            span={1}
          >
            <Tag color="blue">{currentFund.category || 'Other'}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="Risk Level"
            span={1}
          >
            <Tag color={getRiskColor(currentFund.riskLevel)}>
              {currentFund.riskLevel ? `${currentFund.riskLevel} Risk` : 'Risk N/A'}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<><CalendarOutlined /> Launch Date</>}
            span={1}
          >
            {formatDate(currentFund.launchDate)}
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<><DollarOutlined /> Current NAV</>}
            span={1}
          >
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              {formatCurrency(currentFund.nav)}
            </Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<><PercentageOutlined /> Expense Ratio</>}
            span={1}
          >
            <Text strong>
              {currentFund.expenseRatio ? `${currentFund.expenseRatio}%` : 'N/A'}
            </Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="Assets Under Management"
            span={1}
          >
            <Text strong style={{ fontSize: 16 }}>
              {formatAUM(currentFund.aum)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Fund Description */}
      {currentFund.description && (
        <Card title="About This Fund" style={{ marginBottom: 24 }}>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
            {currentFund.description}
          </Paragraph>
        </Card>
      )}

      {/* Action Footer */}
      <Card style={{ marginTop: 24, textAlign: 'center' }}>
        <Space size="large" wrap>
          <Button 
            type="primary" 
            size="large"
            icon={<HeartOutlined />}
            loading={saving}
            onClick={handleSaveFund}
            disabled={!isAuthenticated}
          >
            {saving ? 'Saving...' : 'Save to Watchlist'}
          </Button>
          
          <Button size="large" onClick={() => navigate('/')}>
            Search More Funds
          </Button>
          
          {isAuthenticated && (
            <Button size="large" onClick={() => navigate('/watchlist')}>
              View Watchlist
            </Button>
          )}
          
          <Button size="large" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Space>
        
        {!isAuthenticated && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Please <Button type="link" onClick={() => navigate('/login')}>login</Button> to save funds to your watchlist
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FundDetails;