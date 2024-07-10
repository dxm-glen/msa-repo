import React from 'react';
import './OrderDetail.css';

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

const OrderDetail = ({ orderId }) => {
    const order = orders.find(order => order.id === orderId);

    if (!order) {
        return <div>Select an order to see details</div>;
    }

    return (
        <div>
            <h2>Order Detail</h2>
            <p>Order ID: {order.id}</p>
            <p>Seller Name: {order.sellerName}</p>
            <p>Order Date: {order.orderDate}</p>
            <p>Order Status: {order.status}</p>
            <h3>Items</h3>
            <ul>
                {order.items.map(item => (
                    <li key={item.id}>
                        {item.productName} - {item.quantity} x ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetail;
