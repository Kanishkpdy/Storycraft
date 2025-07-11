// auth.js

// Save token and user object in localStorage
export const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Get token
export const getToken = () => localStorage.getItem('token');

// Get user (parsed) or null if not present
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (err) {
    return null;
  }
};

// Logout and clear localStorage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
