import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderList from '../components/OrderList';

const Orders = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<OrderList />} />
      </Routes>
    </div>
  );
};

export default Orders;
