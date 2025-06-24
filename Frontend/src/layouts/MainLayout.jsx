// // src/layouts/MainLayout.jsx
// import React, { useState } from 'react';
// import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography } from 'antd';
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   HomeOutlined,
//   SearchOutlined,
//   BookOutlined,
//   UserOutlined,
//   LogoutOutlined,
//   SettingOutlined
// } from '@ant-design/icons';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import Logo from '../components/Logo';

// const { Header, Sider, Content } = Layout;
// const { Text } = Typography;

// const MainLayout = ({ children }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   const userMenuItems = [
//     {
//       key: 'profile',
//       icon: <UserOutlined />,
//       label: 'Profile',
//     },
//     {
//       key: 'settings',
//       icon: <SettingOutlined />,
//       label: 'Settings',
//     },
//     {
//       type: 'divider',
//     },
//     {
//       key: 'logout',
//       icon: <LogoutOutlined />,
//       label: 'Logout',
//       onClick: handleLogout,
//     },
//   ];

//   const sidebarItems = [
//     {
//       key: '/',
//       icon: <HomeOutlined />,
//       label: <Link to="/">Home</Link>,
//     },
//     {
//       key: '/search',
//       icon: <SearchOutlined />,
//       label: <Link to="/search">Search Funds</Link>,
//     },
//     {
//       key: '/saved-funds',
//       icon: <BookOutlined />,
//       label: <Link to="/saved-funds">Saved Funds</Link>,
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider 
//         trigger={null} 
//         collapsible 
//         collapsed={collapsed}
//         style={{
//           overflow: 'auto',
//           height: '100vh',
//           position: 'fixed',
//           left: 0,
//           top: 0,
//           bottom: 0,
//         }}
//       >
//         <div style={{ 
//           height: 32, 
//           margin: 16, 
//           display: 'flex', 
//           alignItems: 'center',
//           justifyContent: collapsed ? 'center' : 'flex-start'
//         }}>
//           <Logo collapsed={collapsed} />
//         </div>
        
//         <Menu
//           theme="dark"
//           mode="inline"
//           selectedKeys={[location.pathname]}
//           items={sidebarItems}
//         />
//       </Sider>
      
//       <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
//         <Header style={{ 
//           padding: 0, 
//           background: '#fff', 
//           display: 'flex', 
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           boxShadow: '0 1px 4px rgba(0,21,41,.08)'
//         }}>
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{
//               fontSize: '16px',
//               width: 64,
//               height: 64,
//             }}
//           />
          
//           <Space style={{ marginRight: 24 }}>
//             <Text>Welcome, {user?.name}</Text>
//             <Dropdown
//               menu={{ items: userMenuItems }}
//               placement="bottomRight"
//               trigger={['click']}
//             >
//               <Button type="text" style={{ padding: 0 }}>
//                 <Avatar 
//                   size="default" 
//                   icon={<UserOutlined />}
//                   style={{ backgroundColor: '#1890ff' }}
//                 >
//                   {user?.name?.charAt(0).toUpperCase()}
//                 </Avatar>
//               </Button>
//             </Dropdown>
//           </Space>
//         </Header>
        
//         <Content style={{
//           margin: '24px 16px',
//           padding: 24,
//           minHeight: 280,
//           background: '#fff',
//           borderRadius: 6,
//         }}>
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default MainLayout;


// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Space,
  Typography,
  Avatar,
  Dropdown,
  message,
  Badge,
  Divider,
  Tooltip
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  HomeOutlined,
  DashboardOutlined,
  SettingOutlined,
  BellOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, logout: authLogout } = useAuth();
  
  // Get saved funds count from Redux store
  const { savedFunds } = useAppSelector(state => state.savedFunds);

  const handleLogout = async () => {
    try {
      await authLogout();
      await dispatch(logout()).unwrap();
      message.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      message.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true
    }
  ];

  const sidebarMenuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: <Link to="/search" style={{ color: 'inherit', textDecoration: 'none' }}>Search Funds</Link>
    },
    {
      type: 'divider'
    },
    {
      key: 'portfolio',
      label: 'Portfolio',
      type: 'group',
      children: [
        {
          key: '/saved-funds',
          icon: <StarOutlined />,
          label: (
            <Link to="/saved-funds" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Space>
                <span>My Watchlist</span>
                {savedFunds?.length > 0 && (
                  <Badge 
                    count={savedFunds.length} 
                    size="small" 
                    style={{ backgroundColor: '#52c41a' }} 
                  />
                )}
              </Space>
            </Link>
          )
        },
        {
          key: '/dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
        }
      ]
    }
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['/'];
    if (path.startsWith('/saved-funds')) return ['/saved-funds'];
    if (path.startsWith('/dashboard')) return ['/dashboard'];
    if (path.startsWith('/search')) return ['/search'];
    return [path];
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Fund Explorer';
      case '/search':
        return 'Search Funds';
      case '/saved-funds':
        return 'My Watchlist';
      case '/dashboard':
        return 'Dashboard';
      default:
        return 'Mutual Funds';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Left Sidebar */}
      <Sider 
        trigger={null}
        collapsible 
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
          borderRight: '1px solid #f0f0f0',
          zIndex: 200
        }}
      >
        {/* Logo Section */}
        <div style={{ 
          height: '64px',
          padding: collapsed ? '16px 12px' : '16px 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <Logo collapsed={collapsed} />
        </div>

        {/* User Info Section (when not collapsed and user is logged in) */}
        {!collapsed && user && (
          <div style={{ 
            padding: '16px 24px', 
            borderBottom: '1px solid #f0f0f0',
            background: '#fafafa'
          }}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space>
                <Avatar 
                  size="small" 
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div>
                  <Text strong style={{ fontSize: '14px' }}>
                    {user?.name || 'User'}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {user?.email}
                  </Text>
                </div>
              </Space>
            </Space>
          </div>
        )}

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          style={{ 
            border: 'none',
            background: 'transparent',
            padding: '8px 0'
          }}
          items={sidebarMenuItems}
        />

        {/* Bottom Help Section (when not collapsed) */}
        {!collapsed && (
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            left: '24px', 
            right: '24px',
            padding: '16px',
            background: '#f6f8fa',
            borderRadius: '8px',
            border: '1px solid #e8e8e8'
          }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text style={{ fontSize: '12px', color: '#666' }}>
                Need help? Check out our
              </Text>
              <Button 
                type="link" 
                size="small" 
                style={{ padding: '0', height: 'auto', fontSize: '12px' }}
                onClick={() => navigate('/help')}
              >
                Help Center →
              </Button>
            </Space>
          </div>
        )}
      </Sider>

      {/* Main Layout */}
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 260, 
        transition: 'margin-left 0.2s' 
      }}>
        {/* Top Header */}
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Left Header Section */}
          <Space align="center">
            <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                  fontSize: '16px',
                  width: '32px',
                  height: '32px'
                }}
              />
            </Tooltip>
            
            <Divider type="vertical" />
            <Text strong style={{ fontSize: '16px', color: '#262626' }}>
              {getPageTitle()}
            </Text>
          </Space>

          {/* Right Header Section */}
          <Space align="center" size={16}>
            {/* Welcome message */}
            {user && (
              <Text style={{ color: '#666' }}>
                Welcome, {user.name}
              </Text>
            )}

            {/* Notifications */}
            {user && (
              <Tooltip title="Notifications">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{ fontSize: '16px' }}
                />
              </Tooltip>
            )}

            {/* User Menu or Auth Buttons */}
            {user ? (
              <Dropdown 
                menu={{ items: userMenuItems }} 
                placement="bottomRight"
                trigger={['click']}
              >
                <Button type="text" style={{ padding: '4px 8px', height: 'auto' }}>
                  <Avatar 
                    size="default" 
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Button onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </Space>
            )}
          </Space>
        </Header>

        {/* Main Content */}
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 'calc(100vh - 112px)',
          background: '#fff',
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;