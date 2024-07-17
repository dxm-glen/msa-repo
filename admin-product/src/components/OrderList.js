import React, { useEffect, useState } from 'react';
import { fetchOrders, moveOrderToProduction } from '../data';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
    };

    loadOrders();
  }, []);

  const handleMoveToProduction = async (orderID) => {
    const result = await moveOrderToProduction(orderID);
    if (result) {
      // 성공적으로 이동했으면 로컬 상태를 업데이트 합니다.
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderID === orderID ? { ...order, status: 'In Production' } : order
        )
      );
    } else {
      alert('Failed to move order to production');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Order List</h1>
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
                  <button
                    className={`font-bold py-2 px-4 rounded ${order.status === 'Pending' ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                    onClick={() => handleMoveToProduction(order.orderID)}
                    disabled={order.status !== 'Pending'}
                  >
                    Ready For Production
                  </button>
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
