import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Avatar, Tooltip, message, Spin } from 'antd';
import { RobotOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hiển thị hiệu ứng "đang gõ" khi chatbot trả lời
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // When the chatbox is opened, start with a fresh chat history
      setChatHistory([]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { type: 'user', content: message };
    setChatHistory((prev) => [...prev, newMessage]);

    setIsLoading(true);
    setIsTyping(true); // Bắt đầu hiệu ứng "đang gõ"

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat/', {
        query: message,
      });

      const botMessage = { type: 'bot', content: response.data.response };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      message.error('Unable to send message. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setMessage('');
    }
  };

  const pulseEffect = `
    @keyframes pulse-ring {
      0% { transform: scale(.33); }
      80%, 100% { opacity: 0; }
    }
    @keyframes pulse-dot {
      0% { transform: scale(.8); }
      50% { transform: scale(1); }
      100% { transform: scale(.8); }
    }
  `;

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {!isOpen && (
        <Tooltip title="Ask Ava" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<RobotOutlined />}
            size="large"
            className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none shadow-xl transition-transform transform hover:scale-110"
            onClick={() => setIsOpen(true)}
            style={{ animation: 'pulse-dot 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite' }}
          >
            <style>{pulseEffect}</style>
          </Button>
        </Tooltip>
      )}

      {isOpen && (
        <Card
          className="w-[400px] sm:w-[450px] lg:w-[500px] animate-fade-in rounded-2xl overflow-hidden shadow-2xl"
          bodyStyle={{ padding: 0, height: '600px' }}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                icon={<RobotOutlined />}
                className="bg-indigo-400"
                size="large"
              />
              <span className="text-white text-xl font-bold">Ava</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => {
                setIsOpen(false);
                setChatHistory([]); // Clear the chat history when closing
              }}
              className="text-white hover:text-gray-200"
            />
          </div>

          <div className="h-[520px] flex flex-col bg-gray-50">
            {/* Hiển thị lịch sử hội thoại */}
            <div className="flex-grow overflow-y-auto p-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl mb-4 ${chat.type === 'user' ? 'bg-indigo-100 text-right shadow-sm' : 'bg-white text-left shadow-md'}`}
                >
                  <p className="text-gray-800">{chat.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="text-center">
                  <Spin size="large" className="text-indigo-500" />
                </div>
              )}
              {isTyping && (
                <div className="text-center text-gray-500">
                  Ava is typing...
                </div>
              )}
            </div>

            {/* Nhập tin nhắn */}
            <div className="p-4 border-t bg-white flex items-center space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
                onPressEnter={handleSendMessage}
                className="flex-grow rounded-full shadow-md"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
