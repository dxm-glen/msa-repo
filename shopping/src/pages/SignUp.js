import React, { useState } from 'react';
import "../App.css";
import { useNavigate } from "react-router-dom";
import dynamoDb from '../aws-config';

const SignUp = () => {
  const navigate = useNavigate();
  const [ID, setID] = useState('');
  const [PW, setPW] = useState('');
  const [confirmPW, setConfirmPW] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (PW !== confirmPW) {
      setError('Passwords do not match');
      return;
    }

    const params = {
      TableName: 'hnu_customers_db',
      Item: {
        user_email: ID,
        user_PW: PW,
        user_name: userName,
        user_grade: 'D', // 회원가입 시 기본 등급
      },
    };

    try {
      await dynamoDb.put(params).promise();
      navigate('/Login');
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Error signing up. Please try again.');
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
      <div className="signup-container">
        <form onSubmit={handleSignUp} className="signup-form">
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Email"
            value={ID}
            onChange={(e) => setID(e.target.value)}
          />
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={PW}
            onChange={(e) => setPW(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPW}
            onChange={(e) => setConfirmPW(e.target.value)}
          />
          <button type="submit" className="signup-button">Sign Up</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
