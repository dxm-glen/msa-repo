import React from 'react';
import { useParams } from 'react-router-dom';
import { shipmentData } from '../data';

const ShipmentDetail = () => {
  const { shipmentId } = useParams();
  const shipment = shipmentData.find(s => s.id === parseInt(shipmentId, 10));

  if (!shipment) {
    return <div className="text-red-500">Shipment record not found</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Shipment Detail</h1>
      <p className="text-xl mb-2"><strong>Shipment ID:</strong> {shipment.id}</p>
      <p className="text-xl mb-2"><strong>Product:</strong> {shipment.product}</p>
      <p className="text-xl mb-2"><strong>Quantity:</strong> {shipment.quantity}</p>
      <p className="text-xl mb-2"><strong>Status:</strong> {shipment.status}</p>
    </div>
  );
};

export default ShipmentDetail;