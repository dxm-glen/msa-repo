import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>관리자 홈 페이지</h1>
      <Link to="/inventory">재고 확인</Link>
    </div>
  );
}

export default Home;
