import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import './App.css';

function App() {
  return (
    <Router>
      <header>
        <h1>관리자 재고 관리 시스템</h1>
        <nav>
          <Link to="/">홈</Link>
          <Link to="/inventory">재고 확인</Link>
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
