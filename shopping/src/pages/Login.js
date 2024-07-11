import React, { useState, useContext } from 'react';
import "../App.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import dynamoDb from '../aws-config';

const Login = () => {
  const navigate = useNavigate();
  const [ID, setID] = useState('');
  const [PW, setPW] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = {
      TableName: 'hnu_cutomers_db',
      Key: {
        user_email: ID,
      },
    };

    try {
      const data = await dynamoDb.get(params).promise();
      const user = data.Item;

      if (user && user.user_PW === PW) {
        // 로그인 성공
        login(user);  // UserContext의 login 함수 사용
        navigate('/');
      } else {
        // 로그인 실패
        setError('Invalid ID or password');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Error logging in. Please try again.');
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1 onClick={() => navigate("/")}>NxtShop</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/Login")} className="header-button">Login</button>
          <button onClick={() => navigate("/Cart")} className="header-button">Cart</button>
        </div>
      </header>
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email"
            value={ID}
            onChange={(e) => setID(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={PW}
            onChange={(e) => setPW(e.target.value)}
          />
          <button type="submit" className="login-button">Login</button>
          {error && <p className="error">{error}</p>}
          <button type="button" className="signup-button" onClick={() => navigate("/SignUp")}>SignUp</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
