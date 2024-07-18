import React, { useEffect, useState } from 'react';
import { fetchOrders, moveOrderToProduction, moveOrderToShipped } from '../data';

// 생산 요청 목록 불러오기
const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      // stamp의 오름차순으로 정렬
      data.sort((a, b) => new Date(a.stamp) - new Date(b.stamp));
      setOrders(data);
    };

    loadOrders();
  }, []);

// 버튼을 통해 In Production 상태로 변경
  const handleMoveToProduction = async (orderID) => {
    try {
      const result = await moveOrderToProduction(orderID);

      if (result) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderID === orderID ? { ...order, status: 'In Production' } : order
          )
        );
        alert(result.message);
      } else {
        alert('Failed to move order to production');
      }
    } catch (error) {
      console.error('Error moving order to production:', error);
      alert('Failed to move order to production');
    }
  };

// 버튼을 통해 Shipped 상태로 변경
  const handleMoveToShipped = async (orderID) => {
    try {
      const result = await moveOrderToShipped(orderID);

      if (result) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderID === orderID ? { ...order, status: 'Shipped' } : order
          )
        );
        alert(result.message);
      } else {
        alert('Failed to move order to shipped');
      }
    } catch (error) {
      console.error('Error moving order to shipped:', error);
      alert('Failed to move order to shipped');
    }
  };

// 상태에 따른 버튼 활성화 및 비활성화
  const renderButton = (status, orderID) => {
    switch (status) {
      case 'Pending':
        return (
          <button
            className="font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700 text-white"
            onClick={() => handleMoveToProduction(orderID)}
          >
            Start Production
          </button>
        );
      case 'In Production':
        return (
          <button
            className="font-bold py-2 px-4 rounded bg-gray-500 text-gray-300 cursor-not-allowed"
            disabled
          >
            In Production
          </button>
        );
      case 'Completed':
        return (
          <button
            className="font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-700 text-white"
            onClick={() => handleMoveToShipped(orderID)}
          >
            Shipping
          </button>
        );
      case 'Shipped':
        return (
          <button
            className="font-bold py-2 px-4 rounded bg-gray-500 text-gray-300 cursor-not-allowed"
            disabled
          >
            Shipped
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Order Management</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Stamp</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderID} className="border-t border-gray-700">
                <td className="py-2 px-4">{order.orderID}</td>
                <td className="py-2 px-4">{order.product}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.status}</td>
                <td className="py-2 px-4">{order.stamp}</td>
                <td className="py-2 px-4">
                  {renderButton(order.status, order.orderID)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
