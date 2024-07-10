import React from 'react';
import '../App.css';

const products = [
  { id: 1, name: 'Product 1', price: 100, imageUrl: '' },
  { id: 2, name: 'Product 2', price: 200, imageUrl: '' },
  { id: 3, name: 'Product 3', price: 300, imageUrl: '' },
  { id: 4, name: 'Product 4', price: 400, imageUrl: '' },
  { id: 5, name: 'Product 5', price: 500, imageUrl: '' },
];

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>NxtShop</h1>
        <div className="header-buttons">
          <button className="header-button">Login</button>
          <button className="header-button">Cart</button>
        </div>
      </header>
      <main>
        <ProductList products={products} />
      </main>
    </div>
  );
};

const ProductList = ({ products }) => {
  return (
    <div className="ProductList">
      {products.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

const ProductItem = ({ product }) => {
  return (
    <div className="ProductItem">
      <img src={product.imageUrl} alt={product.name} />
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default App;