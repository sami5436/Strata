# STRATA — Oil Trading Intelligence

A real-time trading intelligence platform for oil & gas producers. Strata helps producers understand what their crude oil is worth today and identifies profitable opportunities.

## What This App Does

Strata answers one question: **"What should I do with my oil today?"**

For producers who pump crude oil out of the ground, there are countless decisions:
- Sell it now or store it?
- Sell locally or ship it to the Gulf Coast?
- Hedge against price drops or ride the market?

Strata analyzes real-time market data and your specific production profile to recommend the best action.

---

## Trading Concepts Explained

### Crude Oil Basics

**What is crude oil pricing?**
Crude oil isn't just one price. There are many benchmarks:
- **WTI (West Texas Intermediate)** — The US benchmark, priced at Cushing, Oklahoma
- **Brent** — The international benchmark, priced in the North Sea
- **Regional grades** — LLS (Louisiana Light Sweet), Mars, WCS (Western Canadian Select), Dubai, Bakken

Each has a different price based on location and quality.

**Quality matters:**
- **API Gravity** — How "light" or "heavy" the oil is (higher = lighter = usually more valuable)
- **Sulfur Content** — "Sweet" (low sulfur) vs "Sour" (high sulfur). Sweet crude is easier to refine.

A producer's crude is priced relative to WTI based on these quality specs. Light sweet crude gets a premium; heavy sour crude trades at a discount.

---

### Differentials & Basis

**What is a differential?**
The difference between your local price and the benchmark (usually WTI).

Example: If WTI is $65/bbl and your Permian crude sells for $62/bbl, your differential is -$3/bbl.

Differentials vary by:
- **Location** — How far you are from Cushing or the Gulf Coast
- **Pipeline capacity** — If pipelines are full, local prices drop
- **Quality** — Your API/sulfur specs

---

### Contango vs Backwardation

The "futures curve" shows prices for future delivery:
- **Contango** — Future prices > spot prices. Oil for delivery in 6 months costs more than oil today. This encourages storage.
- **Backwardation** — Spot prices > future prices. Oil today is worth more than oil in the future. This encourages selling now.

Strata tracks the futures curve and alerts you to contango plays (store now, sell later) or backwardation signals (sell immediately).

---

### Crack Spreads

Refineries turn crude oil into gasoline and diesel. The **crack spread** is their profit margin:

```
3-2-1 Crack Spread = (2 × Gasoline Price + 1 × Diesel Price) / 3 - Crude Price
```

Why producers care:
- High crack spreads = strong refinery demand = they'll pay more for your crude
- Low crack spreads = weak demand = expect lower bids

Strata displays the current crack spread so you know if refiners are hungry for crude.

---

### Hedging with Derivatives

Producers can protect against price drops using financial instruments:

**Put Options**
- Pay a premium upfront to guarantee a minimum sale price
- If prices fall below the "strike," you're protected
- If prices rise, you only lose the premium

**Collars (Costless)**
- Combine a put (floor) with selling a call (cap)
- You give up upside above the cap in exchange for free downside protection
- Popular because there's no upfront cost

**Put Spreads**
- Buy a put at one strike, sell a put at a lower strike
- Cheaper than a naked put, but protection is limited

Strata uses the **Black-Scholes model** to price these options, showing you the fair premium, Greeks (delta, gamma, theta, vega), and recommending strategies based on market volatility.

---

### Arbitrage Opportunities

Arbitrage means profiting from price differences in different markets:

**Location Arbitrage**
- Your basin prices crude at -$5 to WTI
- Gulf Coast prices it at -$2 to WTI
- If transport costs $2/bbl, you profit $1/bbl by shipping to the coast

**Quality Arbitrage**
- Blend different crudes to hit a higher-value spec
- Example: Mix heavy sour with light sweet to hit the optimal API/sulfur for a specific refiner

**Time Arbitrage (Contango Plays)**
- Spot price: $60
- 3-month future: $63
- If storage costs $1.50/month, you profit $1.50 by storing and selling forward

Strata scans for these opportunities automatically.

---

## App Structure

```
strata-app/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── market/             # Market intelligence
│   │   ├── opportunities/      # Trading opportunities
│   │   └── setup/              # Company profile setup
│   ├── components/
│   │   ├── layout/             # Sidebar, TopBar, MainLayout
│   │   ├── ui/                 # Buttons, Cards, Badges
│   │   └── widgets/            # Dashboard widgets
│   └── lib/
│       ├── domain/             # Business logic (arbitrage detection, Black-Scholes)
│       ├── store/              # Zustand state management
│       └── utils/              # Helpers
└── public/                     # Static assets
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Your Crude Value** | Real-time quality-adjusted price for your specific crude |
| **Best Opportunity** | Top trading opportunity ranked by profit potential |
| **Market Prices** | Live benchmarks (WTI, Brent, LLS, Mars, etc.) |
| **Crack Spreads** | 3-2-1 refining margins |
| **Futures Curve** | Contango/backwardation visualization |
| **Hedging Strategies** | Black-Scholes priced puts, collars, spreads |
| **Opportunity Scanner** | Automated arbitrage detection |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **State:** Zustand
- **Data Fetching:** SWR
- **Styling:** Tailwind CSS (custom industrial brutalism theme)
- **Language:** TypeScript

---

## Running Locally

```bash
cd strata-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Design Philosophy

**Industrial Brutalism** — Bold, high-contrast, no-nonsense UI inspired by trading terminals and industrial equipment. Black borders, uppercase headers, monospace numbers, minimal decoration.

Built for oil producers who want answers, not dashboards.
