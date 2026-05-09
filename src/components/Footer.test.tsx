import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('should render footer text with hackathon mention', () => {
    render(<Footer />);
    expect(screen.getByText(/KiraPay/i)).toBeDefined();
    expect(screen.getByText(/Built for Colosseum Frontier Hackathon 2026/i)).toBeDefined();
  });
});
