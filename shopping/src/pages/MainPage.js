import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import productsData from '../product.json';
import { UserContext } from '../App';

const MainPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    setProducts(productsData.products);
    if (user) {
      const userCart = JSON.parse(localStorage.getItem(`cart_${user.ID}`)) || [];
      setCart(userCart);
    }
  }, [user]);

  const addToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/Login');
      return;
    }

    setCart(prevCart => {
      let newCart;
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem(`cart_${user.ID}`, JSON.stringify(newCart));
      return newCart;
    });
  };

  const CartList = () => {
    if (!user) return null; // 로그인하지 않은 경우 카트를 표시하지 않음

    return (
      <div className="CartList">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const ProductList = () => {
    return (
      <div className="ProductList">
        {products.map(product => (
          <div key={product.id} className="ProductItem">
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
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
            }} className="header-button">Logout</button>
          ) : (
            <button onClick={() => navigate('/Login')} className="header-button">Login</button>
          )}
          <button onClick={() => navigate('/Cart')} className="header-button">Cart</button>
        </div>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  );
};

export default MainPage;