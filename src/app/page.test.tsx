/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { kiraPayService } from '@/lib/kirapay';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const filterProps = (props: any) => {
    const {
      initial, animate, exit, transition, whileHover, whileTap, variants,
      style, layoutId, layout, custom,
      ...rest
    } = props;
    return rest;
  };
  
  return {
    motion: {
      div: ({ children, ...props }: any) => <div {...filterProps(props)}>{children}</div>,
      h1: ({ children, ...props }: any) => <h1 {...filterProps(props)}>{children}</h1>,
      p: ({ children, ...props }: any) => <p {...filterProps(props)}>{children}</p>,
      button: ({ children, ...props }: any) => <button {...filterProps(props)}>{children}</button>,
      tr: ({ children, ...props }: any) => <tr {...filterProps(props)}>{children}</tr>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Shield: () => <div data-testid="icon-shield" />,
  Lock: () => <div data-testid="icon-lock" />,
  ScanLine: () => <div data-testid="icon-scan" />,
  Loader2: () => <div data-testid="icon-loader" />,
  CheckCircle2: () => <div data-testid="icon-check" />,
  ChevronRight: () => <div data-testid="icon-chevron" />,
  Vault: () => <div data-testid="icon-vault" />,
  ArrowUpRight: () => <div data-testid="icon-arrow" />,
}));

// Mock kiraPayService
vi.mock('@/lib/kirapay', () => ({
  kiraPayService: {
    generatePaymentLink: vi.fn(),
    verifyPayment: vi.fn(),
  },
}));

// Mock components
vi.mock('@/components/StatusBar', () => ({
  StatusBar: () => <div data-testid="status-bar" />,
}));
vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer" />,
}));
vi.mock('@/components/ParticleBackground', () => ({
  ParticleBackground: () => <div data-testid="particle-bg" />,
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the creation view by default', () => {
    render(<Home />);
    expect(screen.getByText('Create Link')).toBeDefined();
    expect(screen.getByLabelText(/AMOUNT/i)).toBeDefined();
  });

  it('should generate a link and switch to pay view', async () => {
    const mockLink = 'https://kirapay.com/pay/123';
    (kiraPayService.generatePaymentLink as any).mockResolvedValue(mockLink);

    render(<Home />);
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '250' } });
    
    const submitBtn = screen.getByText(/Generate Secure Link/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(kiraPayService.generatePaymentLink).toHaveBeenCalledWith('250');
      expect(screen.getByText('Payment Request')).toBeDefined();
      expect(screen.getByText(mockLink)).toBeDefined();
    });
  });

  it('should simulate payment and move to vault', async () => {
    (kiraPayService.generatePaymentLink as any).mockResolvedValue('link');
    (kiraPayService.verifyPayment as any).mockResolvedValue(true);

    render(<Home />);
    
    // Switch to pay view
    fireEvent.click(screen.getByText(/Generate Secure Link/i));
    
    await waitFor(() => {
      expect(screen.getByText('Simulate KiraPay Payment')).toBeDefined();
    });

    const simulateBtn = screen.getByText('Simulate KiraPay Payment');
    fireEvent.click(simulateBtn);

    expect(screen.getByText('Verifying Webhook...')).toBeDefined();

    await waitFor(() => {
      expect(kiraPayService.verifyPayment).toHaveBeenCalled();
      expect(screen.getByText('Payment Secured. Routing...')).toBeDefined();
    }, { timeout: 2000 });

    // Wait for the timeout that switches to vault
    await waitFor(() => {
      expect(screen.getByText('Private Vault')).toBeDefined();
    }, { timeout: 3000 });
  });

  it('should switch between views using navigation', () => {
    render(<Home />);
    
    const vaultNav = screen.getByRole('button', { name: /VAULT/i });
    fireEvent.click(vaultNav);
    expect(screen.getByText('Private Vault')).toBeDefined();
    
    const createNav = screen.getByRole('button', { name: /CREATE/i });
    fireEvent.click(createNav);
    expect(screen.getByText('Create Link')).toBeDefined();
  });
});
