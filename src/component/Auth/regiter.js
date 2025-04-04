import React, { useState } from 'react';

const Register = ({ showSection }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    setTimeout(() => {
      setMessage({ text: 'Registration successful!', type: 'success' });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  return React.createElement('section', { 'aria-labelledby': 'registration-heading' },
    React.createElement('h2', { id: 'registration-heading' }, 'Register'),
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('label', { htmlFor: 'reg-name' }, 'Full Name:'),
      React.createElement('input', {
        type: 'text',
        id: 'reg-name',
        name: 'name',
        value: formData.name,
        onChange: handleChange,
        placeholder: 'Full Name',
        required: true
      }),
      React.createElement('label', { htmlFor: 'reg-email' }, 'Email:'),
      React.createElement('input', {
        type: 'email',
        id: 'reg-email',
        name: 'email',
        value: formData.email,
        onChange: handleChange,
        placeholder: 'Email',
        required: true
      }),
      React.createElement('label', { htmlFor: 'reg-password' }, 'Password:'),
      React.createElement('input', {
        type: 'password',
        id: 'reg-password',
        name: 'password',
        value: formData.password,
        onChange: handleChange,
        placeholder: 'Password',
        minLength: 6,
        required: true
      }),
      React.createElement('label', { htmlFor: 'reg-confirm-password' }, 'Confirm Password:'),
      React.createElement('input', {
        type: 'password',
        id: 'reg-confirm-password',
        name: 'confirmPassword',
        value: formData.confirmPassword,
        onChange: handleChange,
        placeholder: 'Confirm Password',
        required: true
      }),
      React.createElement('button', { type: 'submit' }, 'Register'),
      message.text && React.createElement('div', { className: `form-message ${message.type}` }, message.text)
    )
  );
};

export default Register;