import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dynamoDb from '../aws-config';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성을 위한 라이브러리

const SignUp = () => {
  const navigate = useNavigate();
  const [ID, setID] = useState('');
  const [PW, setPW] = useState('');
  const [confirmPW, setConfirmPW] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
  // 폼의 기본 동작 방지
  e.preventDefault();

  // Validation: Check if any field is empty
  if (!ID || !PW || !confirmPW || !userName) {
    setError('빈칸을 채워주세요.');
    return;
  }

  if (PW !== confirmPW) {
    setError('비밀번호가 일치하지 않습니다.');
    return;
  }

  // UUID, timestamp 생성
  const user_id = uuidv4();
  const timestamp = new Date().toISOString();

  const params = {
    TableName: 'hnu_cutomers_db',
    Item: {
      user_id: user_id,
      user_email: ID,
      user_PW: PW,
      user_name: userName,
      user_grade: 'D',
      timestamp: timestamp
    },
  };

  try {
    await dynamoDb.put(params).promise(); // DynamoDB에 데이터 추가
    navigate('/Login'); // 회원가입 성공 후 로그인 페이지로 이동
  } catch (err) {
    console.error('회원가입 에러:', err);
    setError('회원가입 도중 에러가 발생했습니다. 다시 시도해주세요.'); // 회원가입 과정에서 오류 발생 시 오류 메시지
  }
};

  return (
    <div>
      <header className="App-header">
        <h1 onClick={() => navigate("/")}>NxtShop</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/Login")} className="header-button">로그인</button>
          <button onClick={() => navigate("/Cart")} className="header-button">장바구니</button>
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
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password Check"
            value={PW}
            onChange={(e) => setPW(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password Check"
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
