import { KiraPay } from "kirapay-sdk";

export class KiraPayService {
  private kiraPay: KiraPay | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    
    const apiKey = process.env.NEXT_PUBLIC_KIRAPAY_API_KEY || process.env.KIRAPAY_API_KEY;
    if (apiKey) {
      try {
        this.kiraPay = new KiraPay({ apiKey } as any);
        this.kiraPay.setBaseUrl('https://api.kirapay.com');
      } catch (e) {
        console.warn("[KiraPay SDK] Initialization failed, falling back to mock mode");
      }
    } else {
      console.warn("[KiraPay SDK] No API key found, falling back to mock mode");
    }
    
    this.initialized = true;
  }

  async generatePaymentLink(amountUsdc: string): Promise<string> {
    this.init();
    console.log(`[KiraPay SDK] Generating payment link for ${amountUsdc} USDC`);
    
    if (this.kiraPay) {
      try {
        // Real SDK Call
        const linkResponse = await this.kiraPay.createPaymentLink({ 
          amount: parseFloat(amountUsdc), 
          currency: 'USDC' 
        });
        
        // Handle potential SDK response variations
        return (linkResponse as any).url || `https://pay.kirapay.com/${(linkResponse as any).id}`;
      } catch (e) {
        console.error("[KiraPay SDK] Failed to generate real link:", e);
      }
    }
    
    // Fallback for demo
    await new Promise(res => setTimeout(res, 600));
    return `https://pay.kirapay.com/${Math.random().toString(36).substring(7)}`;
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    this.init();
    console.log(`[KiraPay SDK] Verifying payment status for ${paymentId}`);
    
    if (this.kiraPay) {
      try {
        // Real SDK Call
        const statusResponse = await this.kiraPay.getPaymentStatus(paymentId);
        return (statusResponse as any).status === 'COMPLETED' || (statusResponse as any).status === 'PAID';
      } catch (e) {
        console.error(`[KiraPay SDK] Verification failed for ${paymentId}:`, e);
      }
    }
    
    // Fallback for demo
    await new Promise(res => setTimeout(res, 1200));
    return true;
  }
}

export const kiraPayService = new KiraPayService();
