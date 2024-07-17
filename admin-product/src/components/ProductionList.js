import React, { useEffect, useState } from 'react';
import { fetchProductions, updateStatusToInProduction, moveProductionToShipments } from '../data';

const ProductionList = () => {
  const [productions, setProductions] = useState([]);

  useEffect(() => {
    const loadProductions = async () => {
      const data = await fetchProductions();
      setProductions(data);
    };

    loadProductions();
  }, []);

  const handleUpdateStatus = async (productionId) => {
    const result = await updateStatusToInProduction(productionId);
    if (result) {
      // 성공적으로 상태가 업데이트되면 로컬 상태를 업데이트 합니다.
      setProductions(prevProductions =>
        prevProductions.map(production =>
          production.productionId === productionId ? { ...production, status: 'In Production' } : production
        )
      );

      // 10초 후 상태를 "Completed"로 변경 (로컬 상태 업데이트)
      setTimeout(() => {
        setProductions(prevProductions =>
          prevProductions.map(production =>
            production.productionId === productionId ? { ...production, status: 'Completed' } : production
          )
        );
      }, 10000);
    } else {
      alert('Failed to update status to In Production');
    }
  };

  const handleMoveToShipments = async (productionId) => {
    const result = await moveProductionToShipments(productionId);
    if (result) {
      // 생산이 성공적으로 이동되면 로컬 상태를 업데이트 합니다.
      setProductions(prevProductions =>
        prevProductions.map(production =>
          production.productionId === productionId ? { ...production, status: 'Ready' } : production
        )
      );
    } else {
      alert('Failed to move production to shipments');
    }
  };

  const renderButton = (status, productionId) => {
    switch (status) {
      case 'Planned':
        return (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUpdateStatus(productionId)}
          >
            Start Production
          </button>
        );
      case 'In Production':
        return (
          <button
            className="bg-gray-500 text-gray-300 cursor-not-allowed font-bold py-2 px-4 rounded"
            disabled
          >
            In Production
          </button>
        );
      case 'Completed':
        return (
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleMoveToShipments(productionId)}
          >
            Ready For Shipments
          </button>
        );
      case 'Ready':
        return (
          <button
            className="bg-gray-500 text-gray-300 cursor-not-allowed font-bold py-2 px-4 rounded"
            disabled
          >
            Ready
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Production Plan</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-2 px-4">Production ID</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productions.map(production => (
              <tr key={production.productionId} className="border-t border-gray-700">
                <td className="py-2 px-4">{production.productionId}</td>
                <td className="py-2 px-4">{production.product}</td>
                <td className="py-2 px-4">{production.quantity}</td>
                <td className="py-2 px-4">{production.status}</td>
                <td className="py-2 px-4">
                  {renderButton(production.status, production.productionId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionList;
