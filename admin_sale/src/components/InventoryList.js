import React from 'react';
import InventoryItem from './InventoryItem';

function InventoryList({ items }) {
  return (
    <div>
      {items.map(item => (
        <InventoryItem key={item.product_id} item={item} />
      ))}
    </div>
  );
}

export default InventoryList;
