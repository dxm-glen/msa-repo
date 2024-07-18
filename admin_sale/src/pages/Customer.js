import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userName, setUserName] = useState('');
  const itemsPerPage = 3;

  // Flask API에서 모든 고객 정보를 가져오는 함수
  const fetchAllCustomers = async (user_name = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/customers`, {
        params: { user_name }
      });
      console.log('Fetched customers:', response.data); // 디버깅 출력
      setCustomers(response.data); // 고객 정보 상태 변수에 저장
    } catch (error) {
      console.error('Error fetching customers:', error); // 오류 발생 시 콘솔에서 확인
    }
  };

  // 컴포넌트가 마운트될 때 모든 고객 정보를 가져옴
  useEffect(() => {
    fetchAllCustomers(); 
  }, []);

  // 현재 페이지에 해당하는 항목을 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 총 페이지 수 계산
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(customers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // 특정 user_name을 검색하는 함수
  const handleSearch = () => {
    fetchAllCustomers(userName);
  };

  return (
    <div>
      <h1>고객 목록</h1>
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)} // 입력된 user_name을 상태에 저장
      />
      <button onClick={handleSearch}>조회</button> 
      <ul>
        {currentCustomers.map((customer) => (
          <li key={customer.user_id}>
            <h2>{customer.user_name}</h2>
            <p>Email: {customer.user_email}</p>
            <p>Phone: {customer.user_phone}</p>
            <p>Grade: {customer.user_grade}</p>
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
