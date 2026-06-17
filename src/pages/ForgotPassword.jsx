// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Send the reset request to our backend
      const response = await api.post('/auth/forgot-password', { email });
      
      // Because we are mocking, tell the user where to look
      setMessage('Request processed. ⚠️ Since this is a test environment, please check your Node.js backend terminal console for your reset link!');
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
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>Enter your email to receive a password reset link</p>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {message && <div style={styles.successAlert}>{message}</div>}

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

          <button type="submit" style={styles.button}>Send Reset Link</button>
        </form>

        <p style={styles.footerText}>
          Remember your password? <Link to="/login" style={styles.link}>Login here</Link>
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
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#cbd5e1'
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