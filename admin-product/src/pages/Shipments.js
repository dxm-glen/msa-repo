import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShipmentList from '../components/ShipmentList';
import ShipmentDetail from '../components/ShipmentDetail';

const Shipments = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ShipmentList />} />
        <Route path=":shipmentId" element={<ShipmentDetail />} />
      </Routes>
    </div>
  );
};

export default Shipments;
