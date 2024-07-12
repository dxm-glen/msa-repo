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

  useEffect(() => {
    console.log('장바구니 추가');
  }, [cart]);

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

      setCart(prevCart => {
        let newCart;
        const existingItem = prevCart.find(item => item.product_id === productId);
        if (existingItem) {
          newCart = prevCart.map(item =>
            item.product_id === productId ? { ...item, amount: item.amount + 1 } : item
          );
        } else {
          newCart = [...prevCart, { product_id: productId, product_name: product.product_name, price: product.price, amount: 1 }];
        }

        localStorage.setItem(`cart_${user.ID}`, JSON.stringify(newCart));
        return newCart;
      });
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
    </div>
  );
};

export default MainPage;
