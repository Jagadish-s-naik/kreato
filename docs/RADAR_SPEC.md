# Money Leak Radar Specification — DealShield

This document specifies the exact mathematical formulas, default constants, and worked golden test calculations for the Money Leak Radar (`/lib/radar.ts`).
All monetary computations are executed in **integer paise** (1 INR = 100 paise).

---

## 1. Mathematical Formulas & Engine Rules

### 1.1. Benchmark Gap
- **Input**: Deliverables list $\sum (q_i \times \text{median\_paise}_i)$, offered fee in paise.
- **Fair Fee**:
  $$\text{Fair Fee} = \sum_{i} (q_i \times \text{benchmark\_median\_paise}(niche, band, format_i))$$
- **Benchmark Gap**:
  $$\text{Benchmark Gap} = \max(0, \text{Fair Fee} - \text{Offered Fee})$$
- *Note*: If Offered Fee >= Fair Fee, Benchmark Gap = 0.

### 1.2. Usage Rights Leak Surcharge
When a brand requests commercial usage or whitelisting rights without paying a separate usage license fee:
- `none` or `organic` posting: $0\%$ of Fair Fee
- `paid_ads` (or whitelisting allowed) with $\text{months} \le 3$: $10\%$ of Fair Fee
- `paid_ads` with $4 \le \text{months} \le 6$: $20\%$ of Fair Fee
- `paid_ads` with $7 \le \text{months} \le 12$: $40\%$ of Fair Fee
- `perpetual` or `unspecified` duration: $100\%$ of Fair Fee

$$\text{Usage Surcharge} = \text{round}\left(\text{Fair Fee} \times \text{usage\_percent}\right)$$

### 1.3. Payment Delay Financing Cost & Risk Premium
Standard baseline credit term for Indian creators is **15 days**.
- If $\text{payment\_days} \le 15$: Cost = 0.
- If $\text{payment\_days} > 15$:
  $$\text{Financing Cost} = \text{round}\left(\text{Offered Fee} \times 0.18 \times \frac{\text{payment\_days} - 15}{365}\right)$$
- Additionally, if $\text{payment\_days} > 30$, a risk premium of $2\%$ of Offered Fee is levied for every full 30-day block beyond 30 days:
  $$\text{Blocks} = \lfloor \frac{\text{payment\_days} - 30}{30} \rfloor$$
  $$\text{Risk Premium} = \text{round}\left(\text{Offered Fee} \times 0.02 \times \text{Blocks}\right)$$
  $$\text{Total Payment Delay Cost} = \text{Financing Cost} + \text{Risk Premium}$$

### 1.4. Exclusivity Leak Surcharge
Restricting the creator from partnering with competing brands in their niche requires compensation:
- Rate: $15\%$ of Fair Fee per 30 days of exclusivity (prorated by days).
- Cap: Maximum $100\%$ of Fair Fee.

$$\text{Exclusivity Cost} = \min\left(\text{Fair Fee}, \text{round}\left(\text{Fair Fee} \times 0.15 \times \frac{\text{exclusivity\_days}}{30}\right)\right)$$

### 1.5. Brand History Penalty
If the creator's Personal Brand Ledger records that this brand has an average payment delay ($\text{avg\_days\_late} > 0$):
$$\text{History Penalty} = \text{round}\left(\text{Offered Fee} \times 0.18 \times \frac{\text{avg\_days\_late}}{365}\right)$$

---

## 2. Configuration Constants (`/lib/config/radar.ts`)

```typescript
export const RADAR_CONFIG = {
  baselinePaymentDays: 15,
  annualFinancingRate: 0.18, // 18% annual interest
  daysInYear: 365,
  riskPremiumThresholdDays: 30,
  riskPremiumPerBlockPercent: 0.02, // 2% per 30 days beyond 30
  riskBlockSizeDays: 30,
  exclusivityRatePer30Days: 0.15, // 15% per 30 days
  maxExclusivityCapPercent: 1.0, // 100% of fair fee max
  usageRates: {
    none: 0.0,
    organic: 0.0,
    paidAdsMonths3: 0.10,
    paidAdsMonths6: 0.20,
    paidAdsMonths12: 0.40,
    perpetualOrUnspecified: 1.00,
  },
} as const;
```

---

## 3. Worked Examples with Golden Numbers (Unit Test Benchmarks)

### Golden Example 1: The Standard Underpriced Skincare Deal
- **Creator Profile**: Skincare, `micro_50k_100k`
- **Simulated Benchmarks**:
  - Reel: ₹30,000 (3,000,000 paise)
  - Story: ₹7,500 (750,000 paise)
- **Brand Offer**:
  - Deliverables: 1 Reel + 2 Stories
  - Offered Fee: ₹25,000 (2,500,000 paise)
  - Usage Rights: Paid ads / whitelisting for 6 months (20%)
  - Payment Terms: 60 days
  - Exclusivity: 60 days category exclusivity
  - Brand History: Brand has paid 47 days late on average previously

#### Step-by-Step Calculation:
1. **Fair Fee**:
   $$1 \times 3,000,000 + 2 \times 750,000 = 4,500,000 \text{ paise } (₹45,000)$$
2. **Benchmark Gap**:
   $$4,500,000 - 2,500,000 = 2,000,000 \text{ paise } (₹20,000)$$
3. **Usage Rights Leak**:
   $$4,500,000 \times 0.20 = 900,000 \text{ paise } (₹9,000)$$
4. **Payment Delay Cost**:
   - $\text{Days} = 60 > 15 \implies \Delta = 45 \text{ days}$
   - Financing Cost $= \text{round}(2,500,000 \times 0.18 \times \frac{45}{365}) = \text{round}(55,479.45) = 55,479 \text{ paise } (₹554.79)$
   - Risk Premium: $\lfloor \frac{60 - 30}{30} \rfloor = 1 \text{ block} \implies 2,500,000 \times 0.02 \times 1 = 50,000 \text{ paise } (₹500.00)$
   - Total Delay Cost $= 55,479 + 50,000 = 105,479 \text{ paise } (₹1,054.79)$
5. **Exclusivity Leak**:
   $$4,500,000 \times 0.15 \times \frac{60}{30} = 4,500,000 \times 0.30 = 1,350,000 \text{ paise } (₹13,500)$$
6. **Brand History Penalty**:
   $$\text{round}\left(2,500,000 \times 0.18 \times \frac{47}{365}\right) = \text{round}(57,945.20) = 57,945 \text{ paise } (₹579.45)$$
7. **Total ₹ at Risk**:
   $$\sum = 2,000,000 + 900,000 + 105,479 + 1,350,000 + 57,945 = 4,413,424 \text{ paise } (₹44,134.24)$$

---

### Golden Example 2: Perpetual Usage & High Payment Delay (Clean Brand)
- **Creator Profile**: Tech, `nano_10k_50k`
- **Simulated Benchmarks**:
  - YouTube Video: ₹20,000 (2,000,000 paise)
- **Brand Offer**:
  - Deliverables: 1 YouTube Video
  - Offered Fee: ₹15,000 (1,500,000 paise)
  - Usage Rights: Perpetual usage (100%)
  - Payment Terms: 90 days
  - Exclusivity: None (0 days)
  - Brand History: New brand (0 days late)

#### Step-by-Step Calculation:
1. **Fair Fee**: $2,000,000 \text{ paise } (₹20,000)$
2. **Benchmark Gap**: $2,000,000 - 1,500,000 = 500,000 \text{ paise } (₹5,000)$
3. **Usage Rights Leak**: $2,000,000 \times 1.00 = 2,000,000 \text{ paise } (₹20,000)$
4. **Payment Delay Cost**:
   - Days $= 90 > 15 \implies \Delta = 75 \text{ days}$
   - Financing Cost $= \text{round}(1,500,000 \times 0.18 \times \frac{75}{365}) = \text{round}(55,479.45) = 55,479 \text{ paise } (₹554.79)$
   - Risk Premium: $\lfloor \frac{90 - 30}{30} \rfloor = 2 \text{ blocks} \implies 1,500,000 \times 0.02 \times 2 = 60,000 \text{ paise } (₹600.00)$
   - Total Delay Cost $= 55,479 + 60,000 = 115,479 \text{ paise } (₹1,154.79)$
5. **Exclusivity Cost**: $0 \text{ paise}$
6. **Brand History Penalty**: $0 \text{ paise}$
7. **Total ₹ at Risk**:
   $$\sum = 500,000 + 2,000,000 + 115,479 = 2,615,479 \text{ paise } (₹26,154.79)$$

