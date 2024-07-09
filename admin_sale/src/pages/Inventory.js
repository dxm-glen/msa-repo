import React, { useEffect, useState } from 'react';
import InventoryList from '../components/InventoryList';
import dynamoDB from '../aws-config';

function Inventory() {
  const [productId, setProductId] = useState('');
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 모든 재고를 가져오는 함수
  const fetchAllInventory = async () => {
    const params = {
      TableName: 'hnu_product_id',
    };

    try {
      const data = await dynamoDB.scan(params).promise();
      console.log('Fetched all data:', data); // 가져온 데이터 콘솔에서 확인
      if (data.Items) {
        setInventory(data.Items); // inventory 상태 변수에 저장
        setFilteredInventory(data.Items); // 필터링된 재고 상태 변수에 저장
      } else {
        console.log('No items found in DynamoDB');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error); // 오류 발생 시 콘솔에서 확인
    }
  };

  // 특정 상품을 쿼리 방식으로 가져오는 함수
  const fetchInventory = async () => {
    const params = {
      TableName: 'hnu_product_id',
      KeyConditionExpression: 'product_id = :pid', // 쿼리 조건 설정
      ExpressionAttributeValues: {
        ':pid': productId, // 쿼리 조건에 사용할 값 설정
      },
    };

    try {
      const data = await dynamoDB.query(params).promise(); // 쿼리 실행
      console.log('Fetched data:', data); // 가져온 데이터 콘솔에서 확인
      if (data.Items) {
        setFilteredInventory(data.Items); // 필터링된 재고 상태 변수에 저장
      } else {
        console.log('No items found in DynamoDB');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error); // 오류 발생 시 콘솔에서 확인
    }
  };

  // 컴포넌트가 마운트될 때 모든 재고를 가져옴
  useEffect(() => {
    fetchAllInventory();
  }, []);

  // productId가 변경될 때마다 특정 상품을 가져옴
  useEffect(() => {
    if (productId) {
      fetchInventory();
    } else {
      setFilteredInventory(inventory); // productId가 비어있을 경우 전체 재고를 표시
    }
  }, [productId, inventory]);

  // 현재 페이지에 해당하는 항목을 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 총 페이지 수 계산
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredInventory.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h1>재고 목록</h1>
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)} // 입력된 productId를 상태에 저장
      />
      <button onClick={fetchInventory}>조회</button> 
      <InventoryList items={currentItems} /> {/* 현재 페이지에 해당하는 항목을 InventoryList에 전달 */}
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

export default Inventory;
