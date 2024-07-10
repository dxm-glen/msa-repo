import React from 'react';

function InventoryItem({ item }) {
  return (
    <div className="inventory-item">
      <h2>{item.product_name}</h2>
      <p>가격: ${item.price}</p>
      <p>수량: {item.quantity}</p>
    </div>
  );
}

export default InventoryItem;
