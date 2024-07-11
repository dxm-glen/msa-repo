import React from 'react';
import { useParams } from 'react-router-dom';
import { orders } from '../data';

const OrderDetail = () => {
  const { orderId } = useParams();
  const order = orders.find(o => o.id === parseInt(orderId, 10));

  if (!order) {
    return <div className="text-red-500">Order not found</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Order Detail</h1>
      <p className="text-xl mb-2"><strong>Order ID:</strong> {order.id}</p>
      <p className="text-xl mb-2"><strong>Product:</strong> {order.product}</p>
      <p className="text-xl mb-2"><strong>Quantity:</strong> {order.quantity}</p>
      <p className="text-xl mb-2"><strong>Status:</strong> {order.status}</p>
      <p className="text-xl mb-2"><strong>Description:</strong> {order.description}</p>
    </div>
  );
};

export default OrderDetail;
