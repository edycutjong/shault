
/* eslint-disable @typescript-eslint/no-explicit-any */
import { KiraPayService } from './kirapay';
import { KiraPay } from 'kirapay-sdk';

vi.mock('kirapay-sdk', () => ({
  KiraPay: vi.fn()
}));

describe('KiraPayService', () => {
  let service: KiraPayService;
  let mockKiraPayInstance: { setBaseUrl: any; createPaymentLink: any; getPaymentStatus: any; };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();

    mockKiraPayInstance = {
      setBaseUrl: vi.fn(),
      createPaymentLink: vi.fn(),
      getPaymentStatus: vi.fn(),
    };

    (KiraPay as any).mockImplementation(function() { return mockKiraPayInstance; });

    // Provide a fresh instance for every test
    service = new KiraPayService();
    
    // Silence console warnings and errors for clean test output
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('init', () => {
    it('should initialize successfully with NEXT_PUBLIC_KIRAPAY_API_KEY', () => {
      vi.stubEnv('NEXT_PUBLIC_KIRAPAY_API_KEY', 'test-key');
      service.init();
      expect(KiraPay).toHaveBeenCalledWith({ apiKey: 'test-key' });
      expect(mockKiraPayInstance.setBaseUrl).toHaveBeenCalledWith('https://api.kirapay.com');
      
      // Calling init again should return early
      service.init();
      expect(KiraPay).toHaveBeenCalledTimes(1);
    });

    it('should initialize successfully with KIRAPAY_API_KEY', () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key-2');
      service.init();
      expect(KiraPay).toHaveBeenCalledWith({ apiKey: 'test-key-2' });
    });

    it('should fallback to mock mode if no API key is provided', () => {
      service.init();
      expect(KiraPay).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("No API key found"));
    });

    it('should fallback to mock mode if KiraPay instantiation throws', () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      (KiraPay as any).mockImplementationOnce(function() {
        throw new Error('Instantiation failed');
      });
      service.init();
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Initialization failed"), expect.any(Error));
    });
  });

  describe('generatePaymentLink', () => {
    it('should generate link using real SDK if url is provided', async () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      mockKiraPayInstance.createPaymentLink.mockResolvedValueOnce({ url: 'https://real.kirapay.com/link' });
      
      const link = await service.generatePaymentLink('10');
      expect(link).toBe('https://real.kirapay.com/link');
      expect(mockKiraPayInstance.createPaymentLink).toHaveBeenCalledWith({ amount: 10, currency: 'USDC' });
    });

    it('should generate link using real SDK if id is provided', async () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      mockKiraPayInstance.createPaymentLink.mockResolvedValueOnce({ id: 'link-id-123' });
      
      const link = await service.generatePaymentLink('20');
      expect(link).toBe('https://pay.kirapay.com/link-id-123');
    });

    it('should fallback to mock link if real SDK throws', async () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      mockKiraPayInstance.createPaymentLink.mockRejectedValueOnce(new Error('API Error'));
      
      const link = await service.generatePaymentLink('10');
      expect(link).toMatch(/^https:\/\/pay\.kirapay\.com\/.+/);
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Failed to generate real link"));
    });

    it('should fallback to mock link if not initialized with SDK', async () => {
      const link = await service.generatePaymentLink('10');
      expect(link).toMatch(/^https:\/\/pay\.kirapay\.com\/.+/);
    });
  });

  describe('verifyPayment', () => {
    it('should return true if status is COMPLETED', async () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      mockKiraPayInstance.getPaymentStatus.mockResolvedValueOnce({ status: 'COMPLETED' });
      
      const result = await service.verifyPayment('pay-123');
      expect(result).toBe(true);
      expect(mockKiraPayInstance.getPaymentStatus).toHaveBeenCalledWith('pay-123');
    });

    it('should return true if status is PAID', async () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      mockKiraPayInstance.getPaymentStatus.mockResolvedValueOnce({ status: 'PAID' });
      
      const result = await service.verifyPayment('pay-123');
      expect(result).toBe(true);
    });

    it('should return false if status is PENDING', async () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      mockKiraPayInstance.getPaymentStatus.mockResolvedValueOnce({ status: 'PENDING' });
      
      const result = await service.verifyPayment('pay-123');
      expect(result).toBe(false);
    });

    it('should fallback to true if SDK throws', async () => {
      vi.stubEnv('KIRAPAY_API_KEY', 'test-key');
      mockKiraPayInstance.getPaymentStatus.mockRejectedValueOnce(new Error('API Error'));
      
      const result = await service.verifyPayment('pay-123');
      expect(result).toBe(true);
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Verification failed for pay-123"));
    });

    it('should fallback to true if not initialized with SDK', async () => {
      const result = await service.verifyPayment('pay-123');
      expect(result).toBe(true);
    });
  });
});
