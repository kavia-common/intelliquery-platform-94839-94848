import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './state/authContext';
import App from './App';

test('renders brand in navbar', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  expect(screen.getByText(/Ocean DSP/i)).toBeInTheDocument();
});
