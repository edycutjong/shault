# Shault — Technical Architecture

## System Architecture

```mermaid
graph TB
    subgraph Primary["Primary Project (Ghopay/Oblivion)"]
        A[Deposit Action] --> B[KiraPay Payment Link]
    end

    subgraph KiraPay["KiraPay SDK"]
        B --> C[Create Payment]
        C --> D[QR Code / Payment Link]
        D --> E[Recipient Pays]
        E --> F[Webhook Callback]
        F --> G[Verify Payment]
    end

    subgraph Vault["Privacy Vault"]
        G --> H[Deposit to Stealth Address]
    end
```

## KiraPay SDK Integration Map

| Feature | Use Case | Depth |
|---|---|---|
| **Create Payment** | Generate payment link with amount | 🟢 Core |
| **Payment Verification** | Verify payment completed | 🟢 Core |
| **Webhook Callback** | Trigger vault deposit on payment | 🟢 Core |

## API Routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/payment/create` | Create KiraPay payment link |
| POST | `/api/payment/webhook` | KiraPay callback → trigger vault deposit |
| GET | `/api/payment/:id/status` | Check payment status |
