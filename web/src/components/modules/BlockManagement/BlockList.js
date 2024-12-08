import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Collapse, List, Tag, Space, Spin, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, HomeOutlined, BuildOutlined, CaretRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API } from '../../../constant/constant';
const { Panel } = Collapse;
const { Title, Text } = Typography;

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState([]);
  const navigate = useNavigate();

  const API_URL = `${API}/master/api`;

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/blocks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlocks(response.data);
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch blocks');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchFloors = useCallback(async (blockId) => {
    try {
      const token = localStorage.getItem('token');
      const floorsResponse = await axios.get(`${API_URL}/blocks/${blockId}/floors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFloors(prev => ({ 
        ...prev, 
        [blockId]: floorsResponse.data 
      }));
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch floors');
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const getFloorTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'COMMERCIAL': return 'blue';
      case 'RESIDENTIAL': return 'green';
      case 'TECHNICAL': return 'orange';
      default: return 'default';
    }
  };

  const renderFloorGrid = (blockFloors, blockId) => {
    return (
      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3 }}
        dataSource={blockFloors}
        renderItem={(floor) => (
          <List.Item>
            <Card 
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-gray-100"
              bodyStyle={{ padding: '16px' }}
            >
              <div className="bg-blue-500 text-white p-4 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">Floor {floor.floor_number}</span>
                  <span className={`bg-${getFloorTypeColor(floor.floor_type)}-400/50 px-3 py-1 rounded-full text-sm`}>
                    {floor.floor_type}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  type="text"
                  icon={<HomeOutlined className="text-blue-500" />}
                  onClick={() => navigate(`/blocks/${blockId}/floors/${floor.floor_id}/apartments/`)}
                  className="w-full text-blue-500 hover:text-blue-600 border border-blue-500 rounded-lg flex items-center justify-center gap-2"
                >
                  View Apartment
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="p-6 max-w-screen-xl overflow-y-auto mx-auto scrollbar-hide">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0 flex items-center">
          <BuildOutlined className="mr-2" /> Block Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/blocks/new')}
          className="flex items-center"
        >
          Add New Block
        </Button>
      </div>
  
      <Spin spinning={loading}>
        <div className="space-y-6 w-full">
          {blocks.map((block) => {
            const blockFloors = floors[block.block_id] || [];
            const floorCount = block.total_floor;
  
            return (
              <Card 
                key={block.block_id}
                className="w-full"
                title={
                  <div className="flex items-center">
                    <span className="mr-2">Block {block.name}</span>
                    <Tag>{floorCount} Floors</Tag>
                  </div>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(`/blocks/${block.block_id}/floors/new`)}
                    className="flex items-center"
                  >
                    Add Floor
                  </Button>
                }
              >
                <Text type="secondary" className="block mb-3">
                  {block.description || 'No description available for this block.'}
                </Text>
  
                <Collapse
                  expandIcon={({ isActive }) => 
                    <CaretRightOutlined className={`transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  }
                  activeKey={activeKey}
                  onChange={(keys) => {
                    setActiveKey(keys);
                    if (keys.includes(block.block_id) && !floors[block.block_id]) {
                      fetchFloors(block.block_id);
                    }
                  }}
                  className="border-none"
                >
                  <Panel 
                    key={block.block_id}
                    header={`View All ${floorCount} Floors`}
                    className="border-none"
                  >
                    {renderFloorGrid(blockFloors, block.block_id)}
                  </Panel>
                </Collapse>
              </Card>
            );
          })}
        </div>
      </Spin>
    </div>
  );  
};

export default BlockList;
