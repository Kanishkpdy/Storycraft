// Header.js
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from './auth';

function Header() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>🏠 Home</Link>
      {user ? (
        <>
          <Link to="/dashboard" style={{ marginRight: '15px' }}>📂 Dashboard</Link>
          <button onClick={handleLogout}>🚪 Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '15px' }}>🔐 Login</Link>
          <Link to="/register">📝 Register</Link>
        </>
      )}
    </div>
  );
}

export default Header;
