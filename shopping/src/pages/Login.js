import React, { useState, useContext } from 'react';
import "../App.css";
import { useNavigate } from "react-router-dom";
import memberData from '../member.json';
import { UserContext } from '../App';

const Login = () => {
  const navigate = useNavigate();
  const [ID, setID] = useState('');
  const [PW, setPW] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = memberData.member.find(m => m.ID === ID && m.PW === PW);
    if (user) {
      // 로그인 성공
      login(user);  // UserContext의 login 함수 사용
      navigate('/');
    } else {
      // 로그인 실패
      setError('Invalid ID or password');
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
          <button type="submit" className="login-button">Login</button>
          {error && <p className="error">{error}</p>}
          <button type="button" className="signup-button" onClick={() => navigate("/SignUp")}>SignUp</button>
        </form>
      </div>
    </div>
  );
};

export default Login;