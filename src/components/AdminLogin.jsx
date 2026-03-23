import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, { username, password });
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Successfully logged in!');
      history.push('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card-glass">
        <h2>Admin Authentication</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="input-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
