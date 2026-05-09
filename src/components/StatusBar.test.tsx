import { render, screen } from '@testing-library/react';

import { StatusBar } from './StatusBar';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Activity: () => <div data-testid="icon-activity" />,
}));

describe('StatusBar', () => {
  it('should render system status and metrics', () => {
    render(<StatusBar />);
    expect(screen.getByText(/SYSTEM ONLINE/i)).toBeDefined();
    expect(screen.getByText(/LATENCY:/i)).toBeDefined();
    expect(screen.getByText(/12ms/i)).toBeDefined();
    expect(screen.getByText(/UPTIME:/i)).toBeDefined();
    expect(screen.getByText(/99.9%/i)).toBeDefined();
  });
});
