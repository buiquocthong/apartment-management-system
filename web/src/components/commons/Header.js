import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Button, Drawer, Dropdown, Avatar, Space } from "antd";
import { 
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined
} from "@ant-design/icons";
import { Building } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const [mobileVisible, setMobileVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const profileItems = [
    {
      key: 'user-info',
      label: userData ? (
        <div className="px-4 py-3 border-b">
          <p className="font-semibold text-gray-800">{userData.name}</p>
          <p className="text-xs text-gray-500">{userData.role}</p>
          <p className="text-xs text-gray-500">{userData.email}</p>
        </div>
      ) : null,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
      className: 'px-2'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
      className: 'px-2'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleLogout,
      className: 'text-red-500 px-2'
    }
  ];

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
    setMobileVisible(false);
  };

  return (
    <header className="w-full bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Building size={32} className="text-white" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">AMS</h1>
              <p className="text-xs text-gray-200">Building Management</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <Menu
              mode="horizontal"
              onClick={handleMenuClick}
              className="bg-transparent border-none text-white min-w-[500px]"
              style={{
                backgroundColor: 'transparent',
              }}
              theme="dark"
              overflowedIndicator={<MenuOutlined className="text-white" />}
            />
            
            <div className="flex items-center space-x-4 pl-4 border-l border-blue-400">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-white hover:text-gray-200 flex items-center justify-center"
                onClick={() => navigate('/notifications')}
              />
              <Dropdown 
                menu={{ items: profileItems }} 
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="w-56"
              >
                <Space className="cursor-pointer hover:text-gray-200">
                  <Avatar 
                    icon={<UserOutlined />} 
                    className="bg-blue-500 border-2 border-white"
                  />
                  <span className="text-sm hidden xl:inline">
                    {userData ? userData.name : 'Profile'}
                  </span>
                </Space>
              </Dropdown>
            </div>
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <Dropdown 
              menu={{ items: profileItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar 
                icon={<UserOutlined />} 
                className="bg-blue-500 border-2 border-white cursor-pointer"
              />
            </Dropdown>
            
            <Button
              type="text"
              className="text-white"
              icon={<MenuOutlined />}
              onClick={() => setMobileVisible(true)}
            />
          </div>

          <Drawer
            title={
              <div className="flex items-center space-x-3">
                <Building size={24} />
                <span className="font-bold">AMS Menu</span>
              </div>
            }
            placement="right"
            onClose={() => setMobileVisible(false)}
            open={mobileVisible}
            bodyStyle={{ padding: 0 }}
            width={300}
          >
          </Drawer>
        </div>
      </div>
    </header>
  );
}

export default Header;