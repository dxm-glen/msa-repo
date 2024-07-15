import '../App.css';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import React, { useState, useEffect, useContext } from 'react';

const checkOutApi = 'http://100.27.224.140:8080/checkout';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [orderMessage, setOrderMessage] = useState('');
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    // 사용자 상태가 변경될 때마다 실행되는 useEffect
    if (user) {
      const userCart = JSON.parse(localStorage.getItem(`cart_${user.ID}`)) || [];
      setCart(userCart);
    }
  }, [user]);

  const handleCheckout = async () => {
    // 결제 버튼 클릭 시 실행되는 함수
    if (!user) {
      setOrderMessage('로그인 후 결제를 진행해주세요.');
      return;
    }

    try {
      console.log("API로 데이터 전송")
      const response = await axios.post(checkOutApi, {
        userId: user.ID,
        cartItems: cart
      });

      if (response.status === 200) {
        localStorage.removeItem(`cart_${user.ID}`);
        setCart([]);
        setOrderMessage('주문이 성공적으로 완료되었습니다!');
        console.log('결제 완료:', response.data);
      }
      else {
        setOrderMessage('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error('결제 오류:', response.data);
      }
    }
    catch (error) {
      console.error('결제 중 오류 발생:', error);
      setOrderMessage('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const cartList = () => {
    if (!user) {
      return <p className="cart-message">장바구니를 보려면 로그인해주세요</p>;
    }
    // 사용자가 로그인한 경우, 장바구니에 있는 상품 목록을 출력합니다.
    return (
      <div className="cart-list">
        <h2>장바구니</h2>
        {cart.length === 0 ? (
          <p className="cart-message">장바구니가 비어있습니다</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map(item => (
                <li key={item.product_id} className="cart-item">
                  <span className="item-name">{item.product_name}</span>
                  <span className="item-price">{item.price}$</span>
                  <span className="item-quantity">x {item.amount}</span>
                  <span className="item-total">{(item.price * item.amount).toFixed(0)}$</span>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <strong>총 금액: {cart.reduce((total, item) => total + item.price * item.amount, 0).toFixed(0)}$</strong>
              <button className="checkout-button" onClick={handleCheckout}>결제하기</button>
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
            // 사용자가 로그인한 경우, 로그아웃 버튼을 렌더링하고 로그아웃 함수를 처리합니다
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