import { useState } from 'react';
import { validateCredentials } from '../utils/validators';

// PUBLIC_INTERFACE
export default function AuthForm({ onSubmit, type = 'login', loading = false, error = '' }) {
  /** Reusable auth form for login and signup. */
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const issues = validateCredentials(form.username, form.password);
    if (issues.length) {
      alert(issues.join('\n'));
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="surface" style={{ padding: 20 }}>
      <div className="stack">
        <div>
          <label htmlFor="username" className="muted">Username</label>
          <input id="username" name="username" className="input" placeholder="you" value={form.username} onChange={handleChange} autoComplete="username" />
        </div>
        <div>
          <label htmlFor="password" className="muted">Password</label>
          <input id="password" name="password" type="password" className="input" placeholder="••••••••" value={form.password} onChange={handleChange} autoComplete={type === 'signup' ? 'new-password' : 'current-password'} />
          <div className="helper">Minimum 6 characters.</div>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Please wait…' : type === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
