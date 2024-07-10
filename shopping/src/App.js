import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Cart from './pages/Cart';
import './App.css';

const App = () => {
  return (
      <Router>
        <div className="App">
          <main>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
};

export default App;