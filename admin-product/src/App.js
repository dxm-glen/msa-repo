import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Production from './pages/Production';
import Shipments from './pages/Shipments';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-black p-4">
          <nav className="container mx-auto flex justify-between">
            <Link to="/" className="text-2xl font-bold">NXT CLOUD Product</Link>
            <div>
              <Link to="/" className="ml-4 text-gray-300 hover:text-white">Dashboard</Link>
              <Link to="/orders" className="ml-4 text-gray-300 hover:text-white">Orders</Link>
              <Link to="/production" className="ml-4 text-gray-300 hover:text-white">Production</Link>
              <Link to="/shipments" className="ml-4 text-gray-300 hover:text-white">Shipments</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders/*" element={<Orders />} />
            <Route path="/production/*" element={<Production />} />
            <Route path="/shipments/*" element={<Shipments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;