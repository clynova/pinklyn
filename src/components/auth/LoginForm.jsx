import React from 'react';

const LoginForm = ({ onSubmit, formData, handleInputChange, handleBlur, errors, touched, isLoading, onSocialLogin }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={() => handleBlur('email')}
        />
        {touched.email && errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          onBlur={() => handleBlur('password')}
        />
        {touched.password && errors.password && <span>{errors.password}</span>}
      </div>
      <div>
        <label htmlFor="rememberMe">Remember Me:</label>
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
        />
      </div>
      {errors.general && <span>{errors.general}</span>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <div>
        <button type="button" onClick={() => onSocialLogin('google')} disabled={isLoading}>
          Login with Google
        </button>
      </div>
    </form>
  );
};

export default LoginForm;