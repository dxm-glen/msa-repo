import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import OrderList from './components/Management';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-black p-4">
          <nav className="container mx-auto flex justify-between">
            <Link to="/" className="text-2xl font-bold">NXT CLOUD Product</Link>
            <div>
              <Link to="/" className="ml-4 text-gray-300 hover:text-white">Home</Link>
              <Link to="/list" className="ml-4 text-gray-300 hover:text-white">List</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<OrderList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
