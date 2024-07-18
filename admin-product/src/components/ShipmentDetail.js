// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchShipmentById } from '../data';

// const ShipmentDetail = () => {
//   const { shipmentId } = useParams();
//   const [shipment, setShipment] = useState(null);

//   useEffect(() => {
//     const loadShipment = async () => {
//       const data = await fetchShipmentById(shipmentId);
//       setShipment(data);
//     };

//     loadShipment();
//   }, [shipmentId]);

//   if (!shipment) {
//     return <div className="text-red-500">Shipment not found</div>;
//   }

//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold mb-4">Shipment Detail</h1>
//       <p className="text-xl mb-2"><strong>Shipment ID:</strong> {shipment.shipmentId}</p>
//       <p className="text-xl mb-2"><strong>Product:</strong> {shipment.product}</p>
//       <p className="text-xl mb-2"><strong>Quantity:</strong> {shipment.quantity}</p>
//       <p className="text-xl mb-2"><strong>Status:</strong> {shipment.status}</p>
//     </div>
//   );
// };

// export default ShipmentDetail;
