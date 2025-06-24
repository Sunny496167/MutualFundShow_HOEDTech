// src/features/savedFunds/SavedFundsList.jsx
import React, { useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Popconfirm,
  message,
  Alert,
  Empty,
  Statistic,
  Row,
  Col
} from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  StarFilled,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchSavedFunds, removeSavedFund, clearErrors } from './savedFundsSlice';
import PageSpinner from '../../components/PageSpinner';

const { Title, Text } = Typography;

const SavedFundsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { savedFunds, loading, error, deleting, deleteError } = useAppSelector(state => state.savedFunds);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedFunds());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (deleteError) {
      message.error(deleteError);
      dispatch(clearErrors());
    }
  }, [deleteError, dispatch]);

  const handleViewFund = (schemeCode) => {
    // Navigate using schemeCode instead of fund ID
    navigate(`/fund/${schemeCode}`);
  };

  const handleDeleteFund = async (savedFundId, fundName) => {
    try {
      await dispatch(removeSavedFund(savedFundId)).unwrap();
      message.success(`${fundName} removed from watchlist`);
    } catch  {
      // Error is handled by useEffect above
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatAUM = (aum) => {
    if (!aum || isNaN(aum)) return 'N/A';
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
      case 'high': return 'red';
      case 'very high': return 'volcano';
      default: return 'default';
    }
  };

  const getReturnColor = (returnValue) => {
    if (!returnValue || isNaN(returnValue)) return '#595959';
    return returnValue >= 0 ? '#52c41a' : '#f5222d';
  };

  const getReturnIcon = (returnValue) => {
    if (!returnValue || isNaN(returnValue)) return null;
    return returnValue >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      title: 'Fund Name',
      dataIndex: 'schemeName',
      key: 'schemeName',
      width: 300,
      render: (schemeName, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: 14 }}>
            {schemeName || 'Unknown Fund'}
          </Text>
          <Space>
            <Tag color="blue" style={{ fontSize: 12 }}>
              {record.category || 'Unknown'}
            </Tag>
            <Tag color="purple" style={{ fontSize: 12 }}>
              {record.amc || 'Unknown AMC'}
            </Tag>
          </Space>
          {record.notes && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Note: {record.notes}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Scheme Code',
      dataIndex: 'schemeCode',
      key: 'schemeCode',
      width: 120,
      render: (schemeCode) => (
        <Text code>{schemeCode || 'N/A'}</Text>
      ),
    },
    {
      title: 'Fund Type',
      dataIndex: 'fundType',
      key: 'fundType',
      width: 120,
      render: (fundType) => (
        <Tag color="geekblue">
          {fundType || 'OTHER'}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => (
        <Text>{category || 'Unknown'}</Text>
      ),
    },
    {
      title: 'AMC',
      dataIndex: 'amc',
      key: 'amc',
      width: 150,
      render: (amc) => (
        <Text>{amc || 'Unknown'}</Text>
      ),
    },
    {
      title: 'Saved On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <Text type="secondary">
          {formatDate(date)}
        </Text>
      ),
      sorter: (a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewFund(record.schemeCode)}
          >
            View
          </Button>
          <Popconfirm
            title="Remove from watchlist"
            description={`Are you sure you want to remove ${record.schemeName || 'this fund'} from your watchlist?`}
            onConfirm={() => handleDeleteFund(record._id, record.schemeName)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleting === record._id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Authentication Required"
          description="Please login to view your saved funds."
          type="warning"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
          }
        />
      </div>
    );
  }

  if (loading) {
    return <PageSpinner />;
  }

  // Simplified stats calculation based on available data
  const calculateStats = () => {
    if (savedFunds.length === 0) return null;
    
    const fundTypes = [...new Set(savedFunds.map(fund => fund.fundType).filter(Boolean))];
    const categories = [...new Set(savedFunds.map(fund => fund.category).filter(Boolean))];
    const amcs = [...new Set(savedFunds.map(fund => fund.amc).filter(Boolean))];

    return {
      totalFunds: savedFunds.length,
      uniqueFundTypes: fundTypes.length,
      uniqueCategories: categories.length,
      uniqueAMCs: amcs.length
    };
  };

  const stats = calculateStats();

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space align="center">
            <StarFilled style={{ color: '#faad14', fontSize: 24 }} />
            <Title level={2} style={{ margin: 0 }}>
              My Watchlist
            </Title>
          </Space>
          <Button type="primary" onClick={() => navigate('/')}>
            Search More Funds
          </Button>
        </div>

        {stats && (
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Total Funds"
                value={stats.totalFunds}
                prefix={<BankOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Fund Types"
                value={stats.uniqueFundTypes}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Categories"
                value={stats.uniqueCategories}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="AMCs"
                value={stats.uniqueAMCs}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>
        )}
      </Card>

      {error ? (
        <Alert
          message="Error Loading Saved Funds"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" onClick={() => dispatch(fetchSavedFunds())}>
              Retry
            </Button>
          }
        />
      ) : savedFunds.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size="small">
                <Text style={{ fontSize: 16 }}>No funds in your watchlist</Text>
                <Text type="secondary">
                  Start by searching and saving mutual funds you're interested in
                </Text>
              </Space>
            }
          >
            <Button type="primary" onClick={() => navigate('/')}>
              Search Mutual Funds
            </Button>
          </Empty>
        </Card>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={savedFunds}
            rowKey="_id"
            scroll={{ x: 1000 }}
            pagination={{
              total: savedFunds.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} funds`,
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default SavedFundsList;