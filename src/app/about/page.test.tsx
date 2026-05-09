import { render, screen } from '@testing-library/react';
import AboutPage from './page';

describe('AboutPage', () => {
  it('should render about page content', () => {
    render(<AboutPage />);
    expect(screen.getByText(/WHAT IT DOES/i)).toBeDefined();
    expect(screen.getByText(/Instant Payment Rails/i)).toBeDefined();
    expect(screen.getByText(/Colosseum Frontier Hackathon 2026/i)).toBeDefined();
  });
});
