import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import dynamoDb from '../aws-config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = {
      TableName: 'hnu_cutomers_db',
      FilterExpression: 'user_email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    try {
      const data = await dynamoDb.scan(params).promise();

      if (data.Items.length > 0) {
        const user = data.Items[0];
        if (user.user_PW === password) {
          login(user);
          navigate('/');
        } else {
          setError('Incorrect password');
        }
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error('Error fetching user from DynamoDB', err);
      setError('Error during login. Please try again later.');
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1 onClick={() => navigate('/')}>NxtShop</h1>
        <div className="header-buttons">
          <button onClick={() => navigate('/Login')} className="header-button">
            로그인
          </button>
          <button onClick={() => navigate('/Cart')} className="header-button">
            장바구니
          </button>
        </div>
      </header>
      <div className="login-container">
        <form className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button" onClick={handleLogin}>
            Login
          </button>
          {error && <p className="error">{error}</p>}
          <button
            type="button"
            className="signup-button"
            onClick={() => navigate('/SignUp')}
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;