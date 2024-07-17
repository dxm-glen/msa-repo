const API_BASE_URL = 'http://35.153.89.182:3000';

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_orders`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return [];
  }
};

export const fetchProductions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_productions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return [];
  }
};


export const fetchShipments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_shipments`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return [];
  }
};

//Order DB에서 Prodcution DB로 데이터 보내기
export const moveOrderToProduction = async (orderID) => {
  try {
    // 주문 상태를 In Production으로 업데이트
    const updateResponse = await fetch(`${API_BASE_URL}/update_order_status_to_in_production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID }),
    });
    if (!updateResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const updateData = await updateResponse.json();
    if (updateData.error) {
      throw new Error(updateData.error);
    }

    // 주문을 생산 테이블로 이동
    const moveResponse = await fetch(`${API_BASE_URL}/move_order_to_production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID }),
    });
    if (!moveResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const moveData = await moveResponse.json();
    return moveData;
  } catch (error) {
    console.error('Error moving order to production:', error);
    return null;
  }
};

// Production DB에서 생산 과정 거치기(10초)
export const updateStatusToInProduction = async (productionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update_status_to_in_production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productionId }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating status to In Production:', error);
    return null;
  }
};

// Production에서 shipments로 데이터 보내기
export const moveProductionToShipments = async (productionID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/move_production_to_shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productionID }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error moving production to shipments:', error);
    return null;
  }
};

// Pending 상태를 Shipped로 바꾼다.
export const updateShipmentStatusToShipped = async (shipmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update_shipments_status_to_shipped`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shipmentId, timestamp: new Date().toISOString() }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating shipment status to shipped:', error);
    return null;
  }
};

// SNS에 알림을 준다.
export const publishToSNS = async (shipmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/publish_to_sns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shipmentId }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error publishing to SNS:', error);
    return null;
  }
};




// export const fetchOrderById = async (orderId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/get_order/${orderId}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     return null;
//   }
// };

// export const fetchProductionById = async (productionId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/get_production/${productionId}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching production:', error);
//     return null;
//   }
// };

// export const fetchShipmentById = async (shipmentId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/get_shipment/${shipmentId}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching shipment:', error);
//     return null;
//   }
// };
