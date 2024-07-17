import React, { useEffect, useState } from 'react';
import InventoryList from '../components/InventoryList';
import axios from 'axios';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productId, setProductId] = useState('');
  const itemsPerPage = 10;

  // Flask API에서 모든 재고 정보를 가져오는 함수
  const fetchAllInventory = async (product_id = '') => {
    try {
      const response = await axios.get(`http://54.166.35.86:8080/api/products`, {
        params: { product_id }
      });
      setInventory(response.data); // 재고 정보 상태 변수에 저장
    } catch (error) {
      console.error('Error fetching inventory:', error); // 오류 발생 시 콘솔에서 확인
    }
  };

  // 컴포넌트가 마운트될 때 모든 재고 정보를 가져옴
  useEffect(() => {
    fetchAllInventory();
  }, []);

  // 현재 페이지에 해당하는 항목을 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 총 페이지 수 계산
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(inventory.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // 특정 product_id를 검색하는 함수
  const handleSearch = () => {
    fetchAllInventory(productId);
  };

  return (
    <div>
      <h1>재고 목록</h1>
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)} // 입력된 product_id를 상태에 저장
      />
      <button onClick={handleSearch}>조회</button> 
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
