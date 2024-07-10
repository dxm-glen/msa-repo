import React from 'react';

function CustomerList({ customers }) {
  return (
    <div>
      {customers.map(customer => (
        <div key={customer.user_id} className="customer-item">
          <h2>{customer.user_name}</h2>
          <p>등급: {customer.user_grade}</p>
          <p>Email: {customer.user_email}</p>
          <p>Phone: {customer.user_phone}</p>
        </div>
      ))}
    </div>
  );
}

export default CustomerList;
