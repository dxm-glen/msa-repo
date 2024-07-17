import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderList from '../components/OrderList';
import OrderDetail from '../components/OrderDetail';

const Orders = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path=":orderId" element={<OrderDetail />} />
      </Routes>
    </div>
  );
};

export default Orders;
