import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import dynamoDb from '../aws-config';
import { UserContext } from '../App';
import '../App.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { user, logout } = useContext(UserContext);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        TableName: 'hnu_product_id',
      };

      try {
        const data = await dynamoDb.scan(params).promise();
        setProducts(data.Items);
      } catch (err) {
        console.error('상품을 불러오는 중 오류가 발생했습니다:', err);
      }
    };

    fetchProducts();

    if (user) {
      const userCart = JSON.parse(localStorage.getItem(`cart_${user.ID}`)) || [];
      setCart(userCart);
    }
  }, [user]);

  const addToCart = async (productId) => {
    if (!user) {
      alert('장바구니에 상품을 추가하려면 로그인이 필요합니다');
      navigate('/Login');
      return;
    }

    try {
      const params = {
        TableName: 'hnu_product_id',
        Key: {
          product_id: productId,
        },
        ProjectionExpression: 'product_name, price',
      };

      const data = await dynamoDb.get(params).promise();
      const product = data.Item;

      // Check if the product is already in the cart
      const existingItemIndex = cart.findIndex(item => item.product_id === productId);

      if (existingItemIndex !== -1) {
        // If the product is already in the cart, increase the quantity
        const updatedCart = cart.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, amount: item.amount + 1 };
          }
          return item;
        });

        setCart(updatedCart);
        localStorage.setItem(`cart_${user.ID}`, JSON.stringify(updatedCart));
      } else {
        // Otherwise, add it as a new item to the cart
        const newItem = {
          product_id: productId,
          product_name: product.product_name,
          price: product.price,
          amount: 1,
          user_email: user.user_email, // Adjusted to user.user_email assuming this is correct
        };

        const newCart = [...cart, newItem];
        setCart(newCart);
        localStorage.setItem(`cart_${user.ID}`, JSON.stringify(newCart));
      }

      setNotification(`${product.product_name}이(가) 장바구니에 추가되었습니다`);

      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (err) {
      console.error('상품 정보를 가져오는 중 오류가 발생했습니다:', err);
    }
  };

  const ProductList = () => {
    return (
      <div className="ProductList">
        {products.map(product => (
          <div key={product.product_id} className="ProductItem">
            <h2>{product.product_name}</h2>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product.product_id)}>장바구니에 추가</button>
          </div>
        ))}
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
              setCart([]);
              navigate('/');
            }} className="header-button">로그아웃</button>
          ) : (
            <button onClick={() => navigate('/Login')} className="header-button">로그인</button>
          )}
          <button onClick={() => navigate('/Cart')} className="header-button">장바구니</button>
        </div>
      </header>
      <main>
        <ProductList />
      </main>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default MainPage;