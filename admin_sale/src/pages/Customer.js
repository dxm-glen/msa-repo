import React, { useState, useEffect } from 'react';

function Customer() {
  // 로컬 상태에 고객 정보 데이터 저장
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 로컬 데이터를 사용하여 고객 정보를 가져오는 함수
  const fetchAllCustomers = () => {
    // 예제 고객 데이터
    const customerData = [
      { customer_id: 1, name: 'Ook', email: 'Ook@example.com', phone: '123-456-7890', tiers: 'Gold'},
      { customer_id: 2, name: 'Logan', email: 'Logan@example.com', phone: '987-654-3210', tiers: 'Vip' },
      { customer_id: 3, name: 'Mark', email: 'Mark@example.com', phone: '555-666-7777', tiers: 'Silver' },
      { customer_id: 4, name: 'Maini', email: 'Maini@example.com', phone: '111-222-3333', tiers: 'Beginner' },
      { customer_id: 5, name: 'Lucy', email: 'Lucy@example.com', phone: '152-199-199', tiers: 'Pletinum'},
      { customer_id: 6, name: 'Glen', email: 'Glen@example.com', phone: '222-222-222', tiers: 'Vip'}
    ];

    // 로컬 상태에 고객 데이터 저장
    setCustomers(customerData);
  };

  // 컴포넌트가 마운트될 때 고객 정보를 가져옴
  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(customers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h1>고객 목록</h1>
      <ul>
        {currentCustomers.map((customer) => (
          <li key={customer.customer_id}>
            <h2>{customer.name}</h2>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Customer;
