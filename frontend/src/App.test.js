import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SafetyFirst app', () => {
  render(<App />);
  const linkElement = screen.getByText(/SafetyFirst/i);
  expect(linkElement).toBeInTheDocument();
});
