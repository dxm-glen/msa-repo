import React, { useState, useEffect } from 'react';
import dynamoDB from '../aws-config';
import CustomerList from '../components/CustomerList'; // CustomerList 컴포넌트 import

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // DynamoDB에서 모든 고객 정보를 가져오는 함수
  const fetchAllCustomers = async () => {
    const params = {
      TableName: 'hnu_cutomers_db',
    };

    try {
      const data = await dynamoDB.scan(params).promise();
      console.log('Fetched all customers:', data); // 가져온 데이터 콘솔에서 확인
      if (data.Items) {
        setCustomers(data.Items); // 고객 정보 상태 변수에 저장
      } else {
        console.log('No customers found in DynamoDB');
      }
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

  return (
    <div>
      <h1>고객 목록</h1>
      <CustomerList customers={currentCustomers} /> {/* 현재 페이지에 해당하는 항목을 CustomerList에 전달 */}
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
