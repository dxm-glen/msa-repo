import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import dynamoDb from '../aws-config';
import { UserContext } from '../App';

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
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
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
      const existingItem = prevCart.find(item => item.product_id === product.product_id);
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem(`cart_${user.ID}`, JSON.stringify(newCart));
      return newCart;
    });

    updateProductQuantity(product.product_id, -1);
  };

  const updateProductQuantity = async (productId, quantityChange) => {
    const params = {
      TableName: 'hnu_product_id',
      Key: {
        product_id: productId,
      },
      UpdateExpression: 'set quantity = quantity + :val',
      ExpressionAttributeValues: {
        ':val': quantityChange,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    try {
      await dynamoDb.update(params).promise();
    } catch (err) {
      console.error('Error updating product quantity:', err);
    }
  };

  const ProductList = () => {
    return (
      <div className="ProductList">
        {products.map(product => (
          <div key={product.product_id} className="ProductItem">
            <h2>{product.product_name}</h2>
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
