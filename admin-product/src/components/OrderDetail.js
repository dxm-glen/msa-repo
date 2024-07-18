// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchOrderById } from '../data';

// const OrderDetail = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     const loadOrder = async () => {
//       const data = await fetchOrderById(orderId);
//       setOrder(data);
//     };

//     loadOrder();
//     const interval = setInterval(loadOrder, 5000);

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, [orderId]);

//   if (!order) {
//     return <div className="text-red-500">Order not found</div>;
//   }

//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold mb-4">Order Detail</h1>
//       <p className="text-xl mb-2"><strong>Order ID:</strong> {order.orderID}</p>
//       <p className="text-xl mb-2"><strong>Product:</strong> {order.product}</p>
//       <p className="text-xl mb-2"><strong>Quantity:</strong> {order.quantity}</p>
//       <p className="text-xl mb-2"><strong>Status:</strong> {order.status}</p>
//       <p className="text-xl mb-2"><strong>Description:</strong> {order.description}</p>
//     </div>
//   );
// };

// export default OrderDetail;
