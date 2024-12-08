import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import UserSavePage from './UserSavePage';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/new" element={<UserSavePage />} />
      <Route path="/edit/:userId" element={<UserSavePage />} />
    </Routes>
  );
};

export default UserRoutes;
