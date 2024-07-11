import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductionList from '../components/ProductionList';
import ProductionDetail from '../components/ProductionDetail';

const Production = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Production Management</h1>
      <Routes>
        <Route path="/" element={<ProductionList />} />
        <Route path=":productionId" element={<ProductionDetail />} />
      </Routes>
    </div>
  );
};

export default Production;