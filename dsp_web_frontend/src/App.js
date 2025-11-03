import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './state/authContext';

// A lightweight protected route wrapper for React Router v6
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  /** App root sets up routes and general layout with Ocean Professional theme. */
  return (
    <div className="app-shell ocean-bg">
      <NavBar />
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <p className="muted">© {new Date().getFullYear()} DSP Web Frontend</p>
      </footer>
    </div>
  );
}

export default App;
