import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import '../App.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [orderMessage, setOrderMessage] = useState('');
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    // user 상태가 변경될 때마다 실행되는 useEffect
    if (user) {
      const userCart = JSON.parse(localStorage.getItem(`cart_${user.ID}`)) || [];
      setCart(userCart);
    }
  }, [user]);

  const handleCheckout = () => {
    // CheckOut 버튼 클릭 시 실행되는 함수
    localStorage.removeItem(`cart_${user.ID}`);
    setCart([]);
    setOrderMessage('Success Order!');
    console.log('CheckOut 눌림');
  };

  const cartList = () => {
    if (!user) {
      return <p className="cart-message">Please login to view your cart</p>;
    }

    // 사용자가 로그인한 경우, 장바구니에 있는 상품 리스트를 출력합니다.
    return (
      <div className="cart-list">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p className="cart-message">Your cart is empty</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map(item => (
                <li key={item.product_id} className="cart-item">
                  <span className="item-name">{item.product_name}</span>
                  <span className="item-price">${item.price}</span>
                  <span className="item-quantity">x {item.amount}</span>
                  <span className="item-total">${(item.price * item.amount).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>Total: ${cart.reduce((total, item) => total + item.price * item.amount, 0).toFixed(2)}</strong>
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
        <h1 onClick={() => navigate('/')}>NxtShop</h1>
        <div className="header-buttons">
          {user ? (
            // 사용자가 로그인한 경우, 로그아웃 버튼을 렌더링하고 로그아웃 함수를 처리
            <button onClick={() => {
              logout();
              navigate('/');
            }} className="header-button">로그아웃</button>
          ) : (
            <button onClick={() => navigate('/Login')} className="header-button">로그인</button>
          )}
          <button onClick={() => navigate('/Cart')} className="header-button">장바구니</button>
        </div>
      </header>
      <main className="cart-main">
        {cartList()}
        {orderMessage && <p className="order-message">{orderMessage}</p>}
      </main>
    </div>
  );
};

export default Cart;
