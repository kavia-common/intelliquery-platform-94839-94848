import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../state/authContext';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login screen. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async ({ username, password }) => {
    setLoading(true); setErr('');
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (e) {
      setErr(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="stack" style={{ marginTop: 24 }}>
        <h1 style={{ margin: 0 }}>Welcome back</h1>
        <div className="muted">Sign in to access the DSP prompt interface.</div>
        <AuthForm onSubmit={handleSubmit} loading={loading} error={err} type="login" />
        <div className="surface" style={{ padding: 16 }}>
          <span className="muted">New here? </span>
          <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
