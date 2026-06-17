// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      setSuccess('Login successful! Redirecting...');

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Connection failed. Is your backend server running?');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your ticketing account</p>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelWrapper}>
              <label style={styles.label}>Password</label>
              
              {/* This is the new clickable Forgot Password link */}
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
            </div>
            
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: 'system-ui, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px 30px',
    borderRadius: '12px',
    backgroundColor: '#1e293b',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    textAlign: 'center'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  subtitle: {
    margin: '0 0 30px 0',
    fontSize: '14px',
    color: '#94a3b8'
  },
  form: {
    textAlign: 'left'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  labelWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#cbd5e1'
  },
  forgotLink: {
    fontSize: '13px',
    color: '#3b82f6',
    textDecoration: 'none'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    boxSizing: 'border-box',
    fontSize: '15px'
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  errorAlert: {
    backgroundColor: '#ef444422',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'left'
  },
  successAlert: {
    backgroundColor: '#22c55e22',
    border: '1px solid #22c55e',
    color: '#86efac',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'left'
  },
  footerText: {
    marginTop: '30px',
    fontSize: '14px',
    color: '#94a3b8'
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none'
  }
};