import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to NXT CLOUD Product</h1>
      <p className="text-lg mb-4">Manage your product orders efficiently.</p>
      <Link to="/list" className="text-2xl text-blue-500 hover:underline">Go to Order Management</Link>
    </div>
  );
};

export default Home;
