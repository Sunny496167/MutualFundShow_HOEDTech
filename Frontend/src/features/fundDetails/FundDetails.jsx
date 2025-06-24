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
  BankOutlined
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
  
  const { currentFund, loading, error, saving, saveError } = useAppSelector(state => state.fundDetails);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchFundDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (saveError) {
      message.error(saveError);
      dispatch(clearErrors());
    }
  }, [saveError, dispatch]);

  const handleSaveFund = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to save funds');
      navigate('/login');
      return;
    }

    if (currentFund) {
      try {
        await dispatch(saveFundToWatchlist(currentFund.id)).unwrap();
        message.success('Fund saved to your watchlist!');
      } catch  {
        // Error is handled by useEffect above
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatAUM = (aum) => {
    if (aum >= 10000000) {
      return `₹${(aum / 10000000).toFixed(1)} Cr`;
    } else if (aum >= 100000) {
      return `₹${(aum / 100000).toFixed(1)} L`;
    }
    return formatCurrency(aum);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'green';
      case 'moderate': return 'orange';
      case 'high': return 'red';
      case 'very high': return 'volcano';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReturnColor = (returnValue) => {
    return returnValue >= 0 ? '#52c41a' : '#f5222d';
  };

  const getReturnIcon = (returnValue) => {
    return returnValue >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  if (loading) {
    return <PageSpinner />;
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Error Loading Fund Details"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => navigate('/')}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (!currentFund) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Fund Not Found"
          description="The requested mutual fund could not be found."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/')}>
              Go Back
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <Space direction="vertical" size="small">
              <Title level={2} style={{ margin: 0 }}>
                {currentFund.name}
              </Title>
              <Space>
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                  {currentFund.category}
                </Tag>
                <Tag color={getRiskColor(currentFund.riskLevel)} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {currentFund.riskLevel} Risk
                </Tag>
              </Space>
            </Space>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<StarOutlined />}
              loading={saving}
              onClick={handleSaveFund}
              size="large"
            >
              Save to Watchlist
            </Button>
            <Button onClick={() => navigate(-1)}>
              Back
            </Button>
          </Space>
        </div>

        {/* NAV and Key Metrics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Current NAV"
              value={currentFund.nav}
              prefix={<DollarOutlined />}
              suffix="₹"
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
              value={currentFund.expenseRatio}
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
              value={currentFund.returns1Y}
              suffix="%"
              precision={2}
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
              value={currentFund.returns3Y}
              suffix="%"
              precision={2}
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
              value={currentFund.returns5Y}
              suffix="%"
              precision={2}
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
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item 
            label={<><UserOutlined /> Fund Manager</>}
            span={1}
          >
            <Text strong>{currentFund.fundManager}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<><BankOutlined /> Fund Category</>}
            span={1}
          >
            <Tag color="blue">{currentFund.category}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="Risk Level"
            span={1}
          >
            <Tag color={getRiskColor(currentFund.riskLevel)}>
              {currentFund.riskLevel} Risk
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
            <Text strong>{currentFund.expenseRatio}%</Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label="Assets Under Management"
            span={2}
          >
            <Text strong style={{ fontSize: 16 }}>
              {formatAUM(currentFund.aum)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Fund Description */}
      {currentFund.description && (
        <Card title="About This Fund">
          <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
            {currentFund.description}
          </Paragraph>
        </Card>
      )}

      {/* Action Footer */}
      <Card style={{ marginTop: 24, textAlign: 'center' }}>
        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            icon={<StarOutlined />}
            loading={saving}
            onClick={handleSaveFund}
          >
            {saving ? 'Saving...' : 'Save to Watchlist'}
          </Button>
          <Button size="large" onClick={() => navigate('/')}>
            Search More Funds
          </Button>
          <Button size="large" onClick={() => navigate('/saved-funds')}>
            View Saved Funds
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default FundDetails;