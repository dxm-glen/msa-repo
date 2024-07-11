import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import OrderList from '../components/OrderList';
import OrderDetail from '../components/OrderDetail';

const Orders = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Orders</h1>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path=":orderId" element={<OrderDetail />} />
      </Routes>
    </div>
  );
};

export default Orders;