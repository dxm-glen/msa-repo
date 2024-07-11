import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShipmentList from '../components/ShipmentList';
import ShipmentDetail from '../components/ShipmentDetail';

const Shipments = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Shipment Management</h1>
      <Routes>
        <Route path="/" element={<ShipmentList />} />
        <Route path=":shipmentId" element={<ShipmentDetail />} />
      </Routes>
    </div>
  );
};

export default Shipments;