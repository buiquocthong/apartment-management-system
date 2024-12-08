import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import BlockList from "../components/modules/BlockManagement/BlockList";
import BlockRoutes from "../components/modules/BlockManagement/routes";
import InvoiceRoutes from "../components/modules/InvoiceManagement/routes";
import ServiceRoutes from "../components/modules/ServiceManagement/routes";
import ContractRoutes from "../components/modules/ContractManagement/routes";
import Profile from "../components/modules/AccountManagement/Profile";
import UserRoutes from "../components/modules/AccountManagement/UserManagement/routes";
import OwnerRoutes from "../components/modules/ResidentManagement/OwnerManagement/routes";
import RenterRoutes from "../components/modules/ResidentManagement/RenterManagement/routes";
import HouseholdRoutes from "../components/modules/ResidentManagement/HouseholdManagement/routes";
import RecordRoutes from "../components/modules/RecordManagement/routes";
import SettingRoutes from "../components/modules/SettingManagement/routes";
import Sidebar from "../components/commons/SideBar";
import Footer from "../components/commons/Footer";
import Header from "../components/commons/Header";
import ChatWidget from "../components/commons/ChatWidget";
import { AuthProvider, useAuth } from "../components/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import Auth from "../components/Auth";
import Notifications from "../components/commons/Notifications";

const MainLayout = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-16 bg-blue-600 text-white shadow-md z-30">
        <div className="flex items-center justify-between px-4 h-full">
          <Header />
          <Button
            type="text"
            className="lg:hidden text-white hover:text-blue-200"
            onClick={toggleSidebar}
            icon={<MenuOutlined />}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-grow pt-16 pb-20">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 w-72 h-[calc(100vh-4rem-5rem)] bg-white shadow-lg z-20 
  ${isSidebarOpen ? "block" : "hidden lg:block"} overflow-y-auto
  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]`}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<BlockList />} />
              <Route path="/blocks/*" element={<BlockRoutes />} />
              <Route path="/invoices/*" element={<InvoiceRoutes />} />
              <Route path="/services/*" element={<ServiceRoutes />} />
              <Route path="/contracts/*" element={<ContractRoutes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/users/*" element={<UserRoutes />} />
              <Route path="/residents/owners/*" element={<OwnerRoutes />} />
              <Route path="/residents/renters/*" element={<RenterRoutes />} />
              <Route
                path="/residents/households/*"
                element={<HouseholdRoutes />}
              />
              <Route path="/records/*" element={<RecordRoutes />} />
              <Route path="/settings/*" element={<SettingRoutes />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </div>
        </main>

        {/* Chat Widget */}
        <div className="fixed bottom-20 right-4">
          <ChatWidget />
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full h-20 bg-blue-600 text-white shadow-lg z-30 border-t-4 border-blue-700">
        <div className="h-full bg-gradient-to-b from-blue-600 to-blue-700">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

const LoginRoute = () => {
  const { setIsAuthenticated } = useAuth();
  return <Auth setIsAuthenticated={setIsAuthenticated} />;
};

const AppRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
