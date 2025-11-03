import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../state/authContext';

// PUBLIC_INTERFACE
export default function SignupPage() {
  /** Signup screen. */
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async ({ username, password }) => {
    setLoading(true); setErr('');
    try {
      await signup(username, password);
      navigate('/', { replace: true });
    } catch (e) {
      setErr(e?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="stack" style={{ marginTop: 24 }}>
        <h1 style={{ margin: 0 }}>Create your account</h1>
        <div className="muted">Join to start querying the DSP system.</div>
        <AuthForm onSubmit={handleSubmit} loading={loading} error={err} type="signup" />
        <div className="surface" style={{ padding: 16 }}>
          <span className="muted">Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
