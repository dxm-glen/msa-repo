import React, { useEffect, useState } from 'react';
import { fetchShipments, updateShipmentStatusToShipped, publishToSNS } from '../data';

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const loadShipments = async () => {
      const data = await fetchShipments();
      setShipments(data);
    };

    loadShipments();
  }, []);

  const handleUpdateStatus = async (shipmentId) => {
    const result = await updateShipmentStatusToShipped(shipmentId);
    if (result) {
      // 성공적으로 상태가 업데이트되면 로컬 상태를 업데이트 합니다.
      setShipments(prevShipments =>
        prevShipments.map(shipment =>
          shipment.shipmentId === shipmentId ? { ...shipment, status: 'Shipped' } : shipment
        )
      );

      // SNS에 메시지 게시
      await publishToSNS(shipmentId);
    } else {
      alert('Failed to update shipment status to shipped');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Shipment List</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-2 px-4">Shipment ID</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(shipment => (
              <tr key={shipment.shipmentId} className="border-t border-gray-700">
                <td className="py-2 px-4">{shipment.shipmentId}</td>
                <td className="py-2 px-4">{shipment.product}</td>
                <td className="py-2 px-4">{shipment.quantity}</td>
                <td className="py-2 px-4">{shipment.status}</td>
                <td className="py-2 px-4">
                  <button
                    className={`font-bold py-2 px-4 rounded ${shipment.status === 'Pending' ? 'bg-green-500 hover:bg-green-700 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                    onClick={() => handleUpdateStatus(shipment.shipmentId)}
                    disabled={shipment.status !== 'Pending'}
                  >
                    Ship
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

export default ShipmentList;
