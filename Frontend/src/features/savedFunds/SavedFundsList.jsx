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

  const handleViewFund = (fundId) => {
    navigate(`/fund/${fundId}`);
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const getReturnColor = (returnValue) => {
    return returnValue >= 0 ? '#52c41a' : '#f5222d';
  };

  const getReturnIcon = (returnValue) => {
    return returnValue >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      title: 'Fund Name',
      dataIndex: ['fund', 'name'],
      key: 'name',
      width: 300,
      render: (name, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: 14 }}>
            {name}
          </Text>
          <Space>
            <Tag color="blue" style={{ fontSize: 12 }}>
              {record.fund.category}
            </Tag>
            <Tag color={getRiskColor(record.fund.riskLevel)} style={{ fontSize: 12 }}>
              {record.fund.riskLevel} Risk
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: 'NAV',
      dataIndex: ['fund', 'nav'],
      key: 'nav',
      width: 120,
      render: (nav) => (
        <Text strong style={{ color: '#1890ff' }}>
          {formatCurrency(nav)}
        </Text>
      ),
      sorter: (a, b) => a.fund.nav - b.fund.nav,
    },
    {
      title: '1Y Returns',
      dataIndex: ['fund', 'returns1Y'],
      key: 'returns1Y',
      width: 120,
      render: (returns) => (
        <Space>
          {getReturnIcon(returns)}
          <Text style={{ color: getReturnColor(returns), fontWeight: 'bold' }}>
            {returns}%
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.fund.returns1Y - b.fund.returns1Y,
    },
    {
      title: '3Y Returns',
      dataIndex: ['fund', 'returns3Y'],
      key: 'returns3Y',
      width: 120,
      render: (returns) => (
        <Space>
          {getReturnIcon(returns)}
          <Text style={{ color: getReturnColor(returns), fontWeight: 'bold' }}>
            {returns}%
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.fund.returns3Y - b.fund.returns3Y,
    },
    {
      title: '5Y Returns',
      dataIndex: ['fund', 'returns5Y'],
      key: 'returns5Y',
      width: 120,
      render: (returns) => (
        <Space>
          {getReturnIcon(returns)}
          <Text style={{ color: getReturnColor(returns), fontWeight: 'bold' }}>
            {returns}%
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.fund.returns5Y - b.fund.returns5Y,
    },
    {
      title: 'AUM',
      dataIndex: ['fund', 'aum'],
      key: 'aum',
      width: 120,
      render: (aum) => (
        <Text>{formatAUM(aum)}</Text>
      ),
      sorter: (a, b) => a.fund.aum - b.fund.aum,
    },
    {
      title: 'Expense Ratio',
      dataIndex: ['fund', 'expenseRatio'],
      key: 'expenseRatio',
      width: 120,
      render: (ratio) => (
        <Text>{ratio}%</Text>
      ),
      sorter: (a, b) => a.fund.expenseRatio - b.fund.expenseRatio,
    },
    {
      title: 'Saved On',
      dataIndex: 'savedAt',
      key: 'savedAt',
      width: 120,
      render: (date) => (
        <Text type="secondary">
          {formatDate(date)}
        </Text>
      ),
      sorter: (a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewFund(record.fund.id)}
          >
            View
          </Button>
          <Popconfirm
            title="Remove from watchlist"
            description={`Are you sure you want to remove ${record.fund.name} from your watchlist?`}
            onConfirm={() => handleDeleteFund(record.id, record.fund.name)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleting === record.id}
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

  const calculateStats = () => {
    if (savedFunds.length === 0) return null;
    
    const totalAUM = savedFunds.reduce((sum, fund) => sum + fund.fund.aum, 0);
    const avgReturns1Y = savedFunds.reduce((sum, fund) => sum + fund.fund.returns1Y, 0) / savedFunds.length;
    const avgReturns3Y = savedFunds.reduce((sum, fund) => sum + fund.fund.returns3Y, 0) / savedFunds.length;
    const avgExpenseRatio = savedFunds.reduce((sum, fund) => sum + fund.fund.expenseRatio, 0) / savedFunds.length;

    return {
      totalAUM,
      avgReturns1Y,
      avgReturns3Y,
      avgExpenseRatio
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
                value={savedFunds.length}
                prefix={<BankOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Avg 1Y Returns"
                value={stats.avgReturns1Y}
                suffix="%"
                precision={2}
                valueStyle={{ color: getReturnColor(stats.avgReturns1Y) }}
                prefix={getReturnIcon(stats.avgReturns1Y)}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Avg 3Y Returns"
                value={stats.avgReturns3Y}
                suffix="%"
                precision={2}
                valueStyle={{ color: getReturnColor(stats.avgReturns3Y) }}
                prefix={getReturnIcon(stats.avgReturns3Y)}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Avg Expense Ratio"
                value={stats.avgExpenseRatio}
                suffix="%"
                precision={2}
                valueStyle={{ color: '#595959' }}
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
            rowKey="id"
            scroll={{ x: 1200 }}
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