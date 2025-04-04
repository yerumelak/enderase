import React, { useState } from 'react';

const Login = ({ showSection, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setMessage({ text: 'Please fill all fields', type: 'error' });
      return;
    }

    setTimeout(() => {
      setUser({ email, name: 'Test User' });
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => showSection('user-dashboard'), 1500);
    }, 1000);
  };

  return React.createElement('section', { 'aria-labelledby': 'login-heading' },
    React.createElement('h2', { id: 'login-heading' }, 'Login'),
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('label', { htmlFor: 'login-email' }, 'Email:'),
      React.createElement('input', {
        type: 'email',
        id: 'login-email',
        value: email,
        onChange: (e) => setEmail(e.target.value),
        placeholder: 'Email',
        required: true
      }),
      React.createElement('label', { htmlFor: 'login-password' }, 'Password:'),
      React.createElement('input', {
        type: 'password',
        id: 'login-password',
        value: password,
        onChange: (e) => setPassword(e.target.value),
        placeholder: 'Password',
        required: true
      }),
      React.createElement('button', { type: 'submit' }, 'Login'),
      message.text && React.createElement('div', { className: `form-message ${message.type}` }, message.text)
    )
  );
};

export default Login;