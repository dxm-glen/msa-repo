import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dynamoDb from '../aws-config';
import { UserContext } from '../App';
import '../App.css';

const checkOutApi = 'http://107.21.32.81:3000';
const successOrder = 'http://107.21.32.81:3000/order';

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

  const checkAndUpdateInventory = async (cartItems) => {
    const itemsToOrder = [];
    const successfulItems = [];

    for (const item of cartItems) {
      const params = {
        TableName: 'hnu_product_id',
        Key: {
          'product_id': item.product_id
        }
      };

      try {
        const result = await dynamoDb.get(params).promise();
        const dbQuantity = result.Item.quantity;

        if (dbQuantity >= item.amount) {
          // 충분한 재고가 있는 경우
          const updateParams = {
            TableName: 'hnu_product_id',
            Key: {
              'product_id': item.product_id
            },
            UpdateExpression: 'set quantity = :newQuantity',
            ExpressionAttributeValues: {
              ':newQuantity': dbQuantity - item.amount
            }
          };
          await dynamoDb.update(updateParams).promise();
          successfulItems.push({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.amount,
            user_email: item.user_email
          });
        } else if (dbQuantity < 10) {
          // 재고 부족 또는 10개 미만인 경우
          itemsToOrder.push({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: 30  // 예시로 임의의 수량을 주문
          });
        }
      } catch (error) {
        console.error('DynamoDB 조회 중 오류 발생:', error);
      }
    }

    return { itemsToOrder, successfulItems };
  };

  const sendOrderToApi = async (items, isSuccess) => {
    try {
      const endpoint = isSuccess ? successOrder : checkOutApi;
      const response = await axios.post(endpoint, {
        userId: user.ID,
        items: items
      });
      console.log('주문 API 응답:', response.data);
    } catch (error) {
      console.error('주문 API 호출 중 오류 발생:', error);
      throw error;
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setOrderMessage('결제를 진행하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const { itemsToOrder, successfulItems } = await checkAndUpdateInventory(cart);

      // 성공적으로 주문된 상품들을 API에 전송
      if (successfulItems.length > 0) {
        await sendOrderToApi(successfulItems, true);
        setOrderMessage('주문이 성공적으로 처리되었습니다.');
      }

      // 재고 부족으로 주문해야 할 상품들을 API에 전송
      if (itemsToOrder.length > 0) {
        await sendOrderToApi(itemsToOrder, false);
        setOrderMessage(successfulItems.length > 0
          ? '일부 상품은 재고 부족으로 주문되지 않았습니다. 다른 상품은 성공적으로 주문되었습니다.'
          : '모든 상품이 품절 또는 재고 부족입니다. 주문되지 않았습니다.');
      } else if (successfulItems.length === 0) {
        setOrderMessage('주문 가능한 상품이 없습니다.');
      }

      // 장바구니 비우기
      setCart([]);
      localStorage.removeItem(`cart_${user.ID}`);
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
      setOrderMessage('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter(item => item.product_id !== productId);
    setCart(updatedCart);
    localStorage.setItem(`cart_${user.ID}`, JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart.map(item => {
      if (item.product_id === productId) {
        const newAmount = item.amount - 1;
        if (newAmount > 0) {
          return { ...item, amount: newAmount };
        } else {
          return null; // 수량이 0 이하인 경우 아이템 제거
        }
      }
      return item;
    }).filter(item => item !== null); // null 아이템 필터링

    setCart(updatedCart);
    localStorage.setItem(`cart_${user.ID}`, JSON.stringify(updatedCart));
  };

  const cartList = () => {
    if (!user) {
      return <p className="cart-message">로그인 후 장바구니를 확인하세요.</p>;
    }
    return (
      <div className="cart-list">
        <h2>장바구니</h2>
        {cart.length === 0 ? (
          <p className="cart-message">장바구니가 비어 있습니다.</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map(item => (
                <li key={item.product_id} className="cart-item">
                  <span className="item-name">{item.product_name}</span>
                  <span className="item-price">{item.price}$</span>
                  <span className="item-quantity">x {item.amount}</span>
                  <span className="item-total">{(item.price * item.amount).toFixed(0)}$</span>
                  <button className="remove-item-button" onClick={() => handleDecreaseQuantity(item.product_id)}>x</button>
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