import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from './auth';

function Header() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <header>
      <div className="left-nav">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>Storycraft</h1>
        </Link>
      </div>

      <div className="right-nav">
        <nav>
          {user ? (
            <>
              <button className="link-button" onClick={goToProfile}>
                👤 {user.usernickname}
              </button>
              <button className="link-button" onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">🔐 Login</Link>
              <Link to="/register" style={{ marginLeft: '20px' }}>
                📝 Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
