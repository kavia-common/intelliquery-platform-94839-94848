import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/authContext';

// PUBLIC_INTERFACE
export default function NavBar() {
  /** Top navigation with brand and auth actions. */
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <div className="brand-badge">🌊</div>
          <span>Ocean DSP</span>
          <span className="badge">Professional</span>
        </div>
        <div className="row">
          <Link to="/" className="btn btn-outline">Home</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/signup" className="btn btn-secondary">Sign up</Link>
            </>
          ) : (
            <>
              <span className="muted">Hi, {user?.username}</span>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
