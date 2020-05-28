import React, { useState } from 'react';

const LoginForm = ({ onSubmit, type }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = field => evt => setFormData({ ...formData, [field]: evt.target.value });

  const handleFormSubmit = evt => {
    evt.preventDefault();
    onSubmit(formData);
    setFormData({ email: '', password: '' });
  };

  return (
    <div className='login-form wrapper'>
      <h1>Login with {type} Auth</h1>
      <form className='form' onSubmit={handleFormSubmit}>
        <input
          type='text'
          placeholder='email'
          onChange={handleInputChange('email')}
          value={formData.email}
        />
        <input
          type='text'
          placeholder='password'
          onChange={handleInputChange('password')}
          value={formData.password}
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
