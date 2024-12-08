import React, { useState } from 'react';
import { 
  Folder, FileText, Settings, Users, DollarSign, 
  Clipboard, ChevronDown, ChevronRight, Building, 
  Key, UserCheck, Archive, LogOut, Search, Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MENU_STRUCTURE = {
  coreManagement: {
    title: 'Core Management',
    items: [
      {
        icon: Building,
        text: 'Block Management',
        subText: 'Manage buildings & facilities',
        path: '/blocks'
      },
      {
        icon: Users,
        text: 'User Management',
        subText: 'Staff & access control',
        path: '/users'
      }
    ]
  },
  residentServices: {
    title: 'Resident Services',
    items: [
      {
        icon: Key,
        text: 'Resident Management',
        subText: 'Handle resident information',
        isParent: true,
        subItems: [
          {
            icon: UserCheck,
            text: 'Owner Management',
            subText: 'Property owners',
            path: '/residents/owners'
          },
          {
            icon: Users,
            text: 'Renter Management',
            subText: 'Rental residents',
            path: '/residents/renters'
          },
          {
            icon: DollarSign,
            text: 'Household Management',
            subText: 'Financial records for households',
            path: '/residents/households'
          }
        ]
      }
    ]
  },
  documentManagement: {
    title: 'Document Management',
    items: [
      {
        icon: Clipboard,
        text: 'Contract Management',
        subText: 'Lease & agreements',
        path: '/contracts'
      },
      {
        icon: Folder,
        text: 'Record Management',
        subText: 'Store and manage records',
        isParent: true,
        subItems: [
          {
            icon: Folder,
            text: 'Active Records',
            subText: 'Manage active records',
            path: '/records'
          },
          {
            icon: Archive,
            text: 'InActive Records',
            subText: 'Manage inactive records',
            path: '/records/inactive_record'
          }
        ]
      },
      {
        icon: FileText,
        text: 'Invoice Management',
        subText: 'Manage billing & payments',
        path: '/invoices'
      }
    ]
  },
  services: {
    title: 'Services',
    items: [
      {
        icon: Settings,
        text: 'Service Management',
        subText: 'Maintenance & services',
        path: '/services'
      }
    ]
  }
};

const Sidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({
    residents: false,
    records: false
  });

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMenuItem = (item) => {
    const IconComponent = item.icon;
    
    if (item.isParent) {
      const isExpanded = item.text === 'Record Management' 
        ? expandedItems.records 
        : expandedItems.residents;
      
      const toggleKey = item.text === 'Record Management' ? 'records' : 'residents';

      return (
        <div key={item.text} className="relative">
          <SidebarItem 
            icon={<IconComponent size={20} />}
            text={item.text}
            subText={item.subText}
            active={isExpanded || location.pathname.startsWith(item.path)}
            onClick={() => toggleExpand(toggleKey)}
            isParent
            suffix={isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          />
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-4">
              {item.subItems.map(subItem => {
                const SubIconComponent = subItem.icon;
                return (
                  <SidebarItem
                    key={subItem.text}
                    icon={<SubIconComponent size={18} />}
                    text={subItem.text}
                    subText={subItem.subText}
                    to={subItem.path}
                    active={location.pathname === subItem.path}
                    subItem
                  />
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <SidebarItem
        key={item.text}
        icon={<IconComponent size={20} />}
        text={item.text}
        subText={item.subText}
        to={item.path}
        active={location.pathname === item.path}
      />
    );
  };

  return (
    <div className="w-72 bg-white shadow-xl h-screen flex flex-col">
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {Object.entries(MENU_STRUCTURE).map(([key, section]) => (
          <div key={key} className="space-y-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(renderMenuItem)}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

const SidebarItem = ({ 
  icon, 
  text, 
  subText,
  to, 
  active = false, 
  onClick, 
  isParent = false,
  suffix,
  subItem = false
}) => {
  const baseClasses = `
    flex items-center justify-between w-full px-4 py-3 rounded-lg 
    transition-all duration-200 ease-in-out 
    group relative
    ${subItem ? 'py-2' : ''}
  `;
  
  const activeClasses = active 
    ? "bg-blue-50 text-blue-600 font-medium" 
    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900";
  
  const content = (
    <>
      <div className="flex items-center flex-1">
        <span className={`
          ${active ? "text-blue-600" : "text-gray-400"} 
          flex-shrink-0
          group-hover:transform group-hover:scale-110
          transition-transform duration-200
        `}>
          {icon}
        </span>
        <div className="ml-3 flex-1">
          <span className={`block ${subItem ? "text-sm" : ""}`}>{text}</span>
          {subText && !subItem && (
            <span className="text-xs text-gray-500 mt-0.5 block group-hover:text-blue-500 transition-colors">
              {subText}
            </span>
          )}
        </div>
      </div>
      {suffix && (
        <span className={`
          ml-2 flex-shrink-0 
          ${active ? "text-blue-600" : "text-gray-400"}
          transition-transform duration-200 ease-in-out
          group-hover:transform group-hover:translate-x-1
        `}>
          {suffix}
        </span>
      )}
      
      <div className={`
        absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8
        rounded-l-full bg-blue-500 transform scale-y-0
        transition-transform duration-200 ease-out
        group-hover:scale-y-100
        ${active ? 'scale-y-100' : ''}
      `}></div>
    </>
  );

  if (isParent || !to) {
    return (
      <button 
        onClick={onClick}
        className={`${baseClasses} ${activeClasses}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${activeClasses}`}
    >
      {content}
    </Link>
  );
};

export default Sidebar;
