import React from 'react';
import './OrderList.css';

const orders = [
    {
        id: 1,
        sellerName: "Kitchen Goods Co.",
        orderDate: "2023-07-01",
        status: "Pending",
        items: [
            { id: 1, productName: "Pan", quantity: 1, price: 29.99 },
            { id: 2, productName: "Knife", quantity: 2, price: 14.99 }
        ]
    },
    {
        id: 2,
        sellerName: "Home Essentials Ltd.",
        orderDate: "2023-07-02",
        status: "Shipped",
        items: [
            { id: 3, productName: "Spatula", quantity: 3, price: 5.99 },
            { id: 4, productName: "Cutting Board", quantity: 1, price: 19.99 }
        ]
    }
];

const OrderList = ({ onSelectOrder }) => {
    return (
        <div>
            <h2>Order List</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id} onClick={() => onSelectOrder(order.id)}>
                        {order.id} - {order.sellerName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
