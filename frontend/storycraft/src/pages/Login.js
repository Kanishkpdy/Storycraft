import React, { useState } from 'react';
import API from '../services/api';
import { saveAuth } from '../auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send username instead of email to match backend expectations
      const res = await API.post('/login', { username: email, password });

      // Backend returns: { token, id, username }
      // We'll structure the user object before saving
      const user = {
        id: res.data.id,
        username: res.data.username,
        usernickname: res.data.usernickname, // ✅ include nickname
    };

      saveAuth(res.data.token, user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>🔐 Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
