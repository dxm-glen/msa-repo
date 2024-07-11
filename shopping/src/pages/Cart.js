import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import "../App.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [orderMessage, setOrderMessage] = useState('');
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const userCart = JSON.parse(localStorage.getItem(`cart_${user.ID}`)) || [];
      setCart(userCart);
    }
  }, [user]);

  const handleCheckout = () => {
    // 주문 처리 로직 추가
    console.log('Order placed:', cart);
    // 주문 완료 후 장바구니 비우기
    localStorage.removeItem(`cart_${user.ID}`);
    setCart([]);
    setOrderMessage('Your order has been placed successfully!');
  };

  const CartList = () => {
    if (!user) {
      return <p className="cart-message">Please login to view your cart</p>;
    }

    return (
      <div className="cart-list">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p className="cart-message">Your cart is empty</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map(item => (
                <li key={item.id} className="cart-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${item.price}</span>
                  <span className="item-quantity">x {item.quantity}</span>
                  <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</strong>
              <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <header className="App-header">
        <h1 onClick={() => navigate("/")}>NxtShop</h1>
        <div className="header-buttons">
          {user ? (
            <button onClick={() => {
              logout();
              navigate('/');
            }} className="header-button">Logout</button>
          ) : (
            <button onClick={() => navigate("/Login")} className="header-button">Login</button>
          )}
          <button onClick={() => navigate("/Cart")} className="header-button">Cart</button>
        </div>
      </header>
      <main className="cart-main">
        <CartList />
        {orderMessage && <p className="order-message">{orderMessage}</p>}
      </main>
    </div>
  );
};

export default Cart;