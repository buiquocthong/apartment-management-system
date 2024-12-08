import React from 'react';
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';

const Footer = () => {
  const socialLinks = [
    { icon: FacebookOutlined, href: 'https://facebook.com' },
    { icon: TwitterOutlined, href: 'https://twitter.com' },
    { icon: LinkedinOutlined, href: 'https://linkedin.com' },
  ];

  return (
    <footer className="w-full bg-blue-600 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
      <div className="text-center lg:text-left">
          <h1 className="text-lg font-bold">AMS</h1>
          <p className="text-xs">Apartment Management System</p>
        </div>

        <div className="flex space-x-4">
          {socialLinks.map(({ icon: Icon, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer">
              <Icon className="text-lg hover:text-gray-300 transition" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
