import React, { useState } from 'react';
import "../App.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [ID, setID] = useState('');
  const [PW, setPW] = useState('');
  const [confirmPW, setConfirmPW] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    if (PW !== confirmPW) {
      setError('Passwords do not match');
      return;
    }
    // 여기에 회원가입 로직을 추가하세요
    // 예: 서버에 사용자 정보를 보내는 API 호출
    console.log('ID:', ID, 'Password:', PW);
    navigate('/Login');
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
            placeholder="ID"
            value={ID}
            onChange={(e) => setID(e.target.value)}
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
