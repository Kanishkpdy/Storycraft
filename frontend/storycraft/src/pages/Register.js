import React, { useState } from 'react';
import API from '../services/api';
import { saveAuth } from '../auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [usernickname, setUsernickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res=await API.post('/register', {
        username: email,
        usernickname,
        password
      });
      const user = {
        id: res.data.id,
        username: res.data.username,
        usernickname: res.data.usernickname
      };

      saveAuth(res.data.token, user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>📝 Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Username (nickname)"
          value={usernickname}
          required
          onChange={e => setUsernickname(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
