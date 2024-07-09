import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>관리자 홈 페이지</h1>
      <p>재고 및 고객 관리 시스템에 오신 것을 환영합니다.</p>
      <Link to="/inventory">재고 확인</Link>
      <br />
      <Link to="/customers">고객 정보</Link>
    </div>
  );
}

export default Home;
