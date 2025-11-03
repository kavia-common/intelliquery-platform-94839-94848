import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/authContext';
import { useHealthCheck } from '../hooks/useHealthCheck';

// PUBLIC_INTERFACE
export default function NavBar() {
  /** Top navigation with brand, auth actions, and backend health indicator. */
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const { status, lastCheckedAt, error, refresh } = useHealthCheck();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const pillClass =
    status === 'online' ? 'pill pill-online' :
    status === 'offline' ? 'pill pill-offline' :
    'pill pill-checking';

  const lastChecked = lastCheckedAt
    ? `Last checked: ${lastCheckedAt.toLocaleTimeString()}`
    : 'Not checked yet';

  const title = [
    `Backend status: ${status}`,
    lastChecked,
    error ? `Error: ${error}` : null
  ].filter(Boolean).join(' | ');

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
          <button
            className={pillClass}
            onClick={refresh}
            title={`${title}\nClick to refresh`}
            aria-label="Backend health status, click to refresh"
            type="button"
          >
            <span className="pill-dot" aria-hidden="true">•</span>
            <span className="pill-text">
              {status === 'checking' ? 'Checking' : status === 'online' ? 'Online' : 'Offline'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
