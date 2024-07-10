import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <h1>Admin Site</h1>
                <nav className="nav-tabs">
                    <Link to="/">Home</Link>
                    <Link to="/orders">Order List</Link>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/orders" element={<OrderListPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

const OrderListPage = () => {
    const [selectedOrderId, setSelectedOrderId] = React.useState(null);

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div className="order-list">
                <OrderList onSelectOrder={setSelectedOrderId} />
            </div>
            <div className="order-detail">
                <OrderDetail orderId={selectedOrderId} />
            </div>
        </div>
    );
};

export default App;
