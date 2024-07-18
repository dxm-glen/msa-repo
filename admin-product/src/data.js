import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_orders`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const moveOrderToProduction = async (orderID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update_order_status_to_in_production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error moving order to production:', error);
    return null;
  }
};

export const moveOrderToShipped = async (orderID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update_order_status_to_shipped`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderID }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error moving order to shipped:', error);
    return null;
  }
};