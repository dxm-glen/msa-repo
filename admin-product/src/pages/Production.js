import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductionList from '../components/ProductionList';
import ProductionDetail from '../components/ProductionDetail';

const Production = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductionList />} />
        <Route path=":productionId" element={<ProductionDetail />} />
      </Routes>
    </div>
  );
};

export default Production;
