import React, { useState } from 'react';
import { 
  Card, 
  Switch, 
  Select, 
  Input, 
  Button 
} from 'antd';

const { Option } = Select;

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'en',
    notifications: true,
    username: ''
  });

  const updateSettings = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <Card title="User Settings" bordered={false}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username</label>
          <Input 
            placeholder="Enter your username"
            value={settings.username}
            onChange={(e) => updateSettings('username', e.target.value)}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px' 
        }}>
          <span>Dark Mode</span>
          <Switch 
            checked={settings.darkMode}
            onChange={(checked) => updateSettings('darkMode', checked)}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Language</label>
          <Select 
            style={{ width: '100%' }}
            value={settings.language}
            onChange={(value) => updateSettings('language', value)}
          >
            <Option value="en">English</Option>
            <Option value="vi">Tiếng Việt</Option>
            <Option value="fr">Français</Option>
          </Select>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px' 
        }}>
          <span>Notifications</span>
          <Switch 
            checked={settings.notifications}
            onChange={(checked) => updateSettings('notifications', checked)}
          />
        </div>

        <Button 
          type="primary" 
          block
          onClick={() => alert('Settings saved!')}
        >
          Save Changes
        </Button>
      </Card>
    </div>
  );
};

export default Settings;