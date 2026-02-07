# STRATA — Oil Trading Intelligence Platform
## Context Document for Development Agent

---

## What We're Actually Building

A **real-time trading intelligence dashboard** for oil & gas companies that answers one question:

**"What should I do with my oil TODAY to make the most money?"**

This isn't a price tracker. This isn't a news aggregator. This is a **decision engine** that connects your production specs + live market data + refining capabilities into actionable trading opportunities.

**The core insight:** Most oil companies know they produce 10,000 barrels/day of light sweet crude. But they don't know whether they should:
- Sell it immediately at today's spot price
- Store it for 3 months (contango play)
- Swap it for cheaper heavy oil and pocket the difference
- Route it to their own refinery vs. selling to the market

**STRATA tells them. In real-time. With dollar figures.**

---

## The Core Insight (Why This Matters)

Oil companies make money in three ways:
1. **Producing oil** (upstream)
2. **Refining oil** (downstream)
3. **Trading oil** (the hidden goldmine)

Most companies are terrible at #3. They:
- Sell their crude at posted prices without checking alternatives
- Don't track quality differentials (light vs heavy, sweet vs sour)
- Miss arbitrage windows (crack spreads, location spreads, time spreads)
- Can't model "what if" scenarios fast enough

**Example of money left on the table:**
- You produce 10,000 bpd of Light Sweet Crude (API 42°, 0.3% sulfur)
- WTI spot: $80/bbl
- Heavy Sour Crude: $60/bbl
- You own a complex refinery (can process heavy oil)

**What most companies do:** Refine their own crude. Net margin: $12/bbl crack spread.

**What STRATA tells them to do:** 
1. Sell your light sweet at $80
2. Buy heavy sour at $60
3. Refine the cheap stuff
4. **Pocket $20/bbl extra** = **$200,000/day**

That's $73 million/year found in a spreadsheet no one was checking.

**STRATA makes this obvious. In real-time. Updated every hour.**

---

## Who Uses This

### Primary: Commercial Managers at Integrated Companies
People responsible for maximizing revenue from production + refining

**Example User**: VP of Commercial at a 50,000 bpd integrated company
- Has production of light sweet crude
- Owns a complex refinery
- Currently: Sends all crude to their refinery (default behavior)
- **STRATA shows them:** "You're leaving $150K/day on the table. Sell 60% of production, buy discount crude."

### Secondary: Trading Desks at Upstream Producers
Teams deciding when/where to sell crude production

**Example User**: Crude Oil Trader at an E&P company
- Produces 30,000 bpd from multiple fields (different grades)
- Can sell locally or ship to Gulf Coast
- Needs to decide: Sell now? Store? Blend grades?
- **STRATA shows them:** Location spreads, quality premiums, storage economics all in one view

### Tertiary: Supply Chain Managers at Refiners
People buying crude feedstock for refineries

**Example User**: Procurement Manager at a refinery
- Buys 100,000 bpd of crude from multiple suppliers
- Tracks 20+ crude grades (WTI, LLS, Mars, WCS, etc.)
- **STRATA shows them:** Cheapest crude slate for today's product prices + which grades maximize gasoline yield

### Future: Independent Traders
People who buy/sell without owning assets

**Example User**: Physical crude trader
- No production, no refinery
- Purely arbitrage plays
- **STRATA shows them:** Mispricings, contango/backwardation, quality spreads

---

## The User Journey (Business Flow)

### Phase 1: Setup (3 Minutes)
**Goal**: Tell STRATA about your crude oil and capabilities

**User inputs:**
1. **Company Profile**: 
   - Type: Producer / Refiner / Integrated / Trader
   - Daily production volume (if applicable)
   - Refinery capacity (if applicable)
   
2. **Crude Specifications**:
   - What you produce: API gravity, sulfur content
   - What you can refine (if integrated): Complexity index, preferred crude types
   
3. **Market Preferences**:
   - Primary benchmark (WTI, Brent, Dubai)
   - Typical quality differential (if known)
   - Storage capacity (optional, for contango plays)

**System does:**
- Calcifies your crude grade (Light Sweet, Heavy Sour, etc.)
- Starts tracking relevant price differentials
- Connects to market APIs for real-time pricing
- Initializes arbitrage detection algorithms

**Output:** "Your crude trades at WTI + $2.50/bbl. Tracking 12 relevant market spreads."

---

### Phase 2: The Dashboard (Home Screen)
**Goal**: See all trading-relevant information at a glance

**User sees (4 widgets):**

**Widget 1: Your Crude Value (Top Left, Hero)**
- Big number: Current market value of your crude
- Example: "$82.50/bbl" in huge monospace font
- Subtext: "WTI $80.00 + $2.50 quality premium"
- Change indicator: "+$1.20 vs. yesterday" in green

**Widget 2: Best Opportunity (Top Right)**
- Current highest-value trade recommendation
- Example: "Quality Arbitrage: +$180K/day"
- Brief description: "Sell your crude, buy Mars Sour for refinery"
- "View Details →" button

**Widget 3: Market Overview (Bottom Left)**
- Live prices for key benchmarks:
  - WTI Spot: $80.00
  - Brent: $83.50
  - Gasoline: $2.45/gal
  - Diesel: $2.78/gal
- Crack spread: "$14.50/bbl (↑ strong)"

**Widget 4: Quick Calculators (Bottom Right)**
- Dropdown scenarios:
  - "Refine vs. Sell" → Shows margin comparison
  - "Storage Economics" → Shows contango profit
  - "Grade Swap" → Shows quality arbitrage
- Input fields for quick what-if modeling

**Business value:**
- **Decision speed**: See what to do in <10 seconds
- **Opportunity capture**: Catch arbitrage windows before they close
- **Risk awareness**: Know when margins are thin vs. fat

**Feasibility:**
- All data from free APIs (EIA, Alpha Vantage)
- Calculations are simple arithmetic (no ML needed)
- Updates every 15 minutes (market data refresh rate)

---

### Phase 3: Opportunity Explorer (Deep Dive)
**Goal**: Understand WHY an opportunity exists and HOW to execute

**User clicks:** "Quality Arbitrage: +$180K/day" from dashboard

**Detail screen shows:**

**Section 1: The Math (Top)**
```
Your Production:  10,000 bpd × $82.50 = $825,000/day
Alternative Input: 10,000 bpd × $62.00 = $620,000/day
                   ________________________________
Arbitrage Gain:                         $205,000/day
```

**Section 2: The Trade (Middle)**
- **Action 1:** Sell your Light Sweet production → Gulf Coast buyer
- **Action 2:** Buy Heavy Sour (Mars or WCS) → Deliver to your refinery
- **Logistics:** Need 500,000 bbl storage + 2 week lead time
- **Risk:** Quality spread could narrow by $3-5/bbl

**Section 3: Sensitivity Analysis (Bottom)**
- Interactive sliders:
  - "What if quality spread narrows to $15/bbl?" → Profit drops to $150K/day
  - "What if we can only swap 50% of volume?" → Profit: $102K/day
- Break-even calculation: "Profitable down to $12/bbl spread"

**Section 4: Historical Context**
- Chart: Quality spread over last 90 days
- Average: $18/bbl
- Current: $20.50/bbl (**above average = good opportunity**)
- Trend: Widening (bullish for this trade)

**Interaction:**
- "Execute Trade" button → (Future: connects to trading system)
- "Set Alert" → Notify me if spread narrows to $15/bbl
- "Save Scenario" → Bookmark this for later

---

### Phase 4: Market Intelligence (Side Tab)
**Goal**: Understand market context beyond just prices

**User sees:**

**Section 1: Price Dashboard**
- Live table of all relevant crude grades:
  | Grade | Price | Change | vs. WTI |
  |-------|-------|--------|---------|
  | WTI Cushing | $80.00 | +$1.20 | -- |
  | Brent | $83.50 | +$0.95 | +$3.50 |
  | LLS | $82.50 | +$1.10 | +$2.50 |
  | Mars | $76.00 | +$0.80 | -$4.00 |
  | WCS | $62.00 | +$0.50 | -$18.00 |

**Section 2: Crack Spreads**
- 3-2-1 Crack Spread: $14.50/bbl
- Gasoline Crack: $28.00/bbl
- Diesel Crack: $32.50/bbl
- Interpretation: "Strong refining margins. Consider buying crude for processing."

**Section 3: Contango/Backwardation**
- Futures curve chart showing next 12 months
- If contango (upward sloping): "Storage is profitable"
- If backwardation (downward sloping): "Sell immediately, don't store"

**Section 4: Quality Spreads**
- Light-Heavy Differential: $18/bbl (wide = good for quality arb)
- Sweet-Sour Differential: $7.50/bbl
- Historical average + current vs. average

**Business value:**
- All context in one place (don't need Bloomberg terminal)
- See relationships (crack spreads vs. quality spreads)
- Spot opportunities (contango plays, margin expansion)

---

### Phase 5: Alerts & Notifications (Background)
**Goal**: Don't miss opportunities or risks

**Alert types:**

**Price Alerts**
- "WTI hit your target of $85/bbl"
- "Your crude premium dropped to $1.50 (below average)"

**Opportunity Alerts**
- "New arbitrage detected: Location spread widened → +$95K/day"
- "Contango deepened: Storage profit now $8/bbl"

**Risk Alerts**
- "Quality spread narrowing → Current arbitrage profit down 30%"
- "Crack spread collapsed → Refining no longer profitable"

**Delivery:**
- In-app notification badge
- Email (for high-value opportunities)
- SMS (optional, for critical alerts)
- Slack webhook (for trading teams)

**User control:**
- Set custom thresholds: "Alert me if WTI moves >$2/bbl in 1 hour"
- Choose channels: "Email for opportunities, SMS for risks"
- Quiet hours: "No alerts between 10pm-7am"

---

## The Unique UI Philosophy

### What We're NOT Building
❌ Another dark mode dashboard with cyan gradients
❌ Generic SaaS with rounded corners and soft shadows
❌ Minimalist white space with "modern" sans-serif

### What We ARE Building
**"Industrial Brutalism"** — Think Soviet control rooms meet Swiss typography

**Visual Language:**
- **Stark contrast**: Pure white background, black text, sharp colored accents
- **Heavy typography**: Big, bold numbers. Data is the hero.
- **Utilitarian layout**: No decorative elements. Every pixel has a purpose.
- **Physical metaphors**: Tanks look like actual cylindrical tanks (not rounded rectangles)
- **Analog nostalgia**: Gauges with needles, dials that rotate, switches that flip

**Color System:**
- **Base**: White (#FFFFFF) background, Black (#000000) text
- **Data**: Oil Black (#1A1A1A) for primary metrics
- **Alerts**: Industrial Yellow (#FFD500), Safety Red (#E60000)
- **Good**: Forest Green (#228B22) for profit/normal status
- **Neutral**: Concrete Gray (#808080) for secondary info

**Typography:**
- **Metrics/Data**: Monospace at large sizes (96px for hero numbers)
- **Labels**: Uppercase sans-serif, tightly kerned
- **Body**: Standard sans, but minimal usage (this is not a text-heavy app)

**Layout Principles:**
1. **Grid rigidity**: Everything snaps to a 8px grid
2. **Information density**: No wasted space. More data visible = better decisions.
3. **Scanability**: User should understand asset status in <3 seconds
4. **Action-oriented**: Buttons are obvious, states are clear

**Distinctive Elements:**
- **Tank visualization**: Actual cylinder shape, fills from bottom with physical liquid wave effect
- **Flow lines**: Animated dots moving through pipes (like old pneumatic tube systems)
- **Gauges**: Semi-circle dials with red zones, actual rotating needles
- **Switches**: Physical toggle switches for well on/off states
- **Paper textures**: Subtle graph paper grid on backgrounds (engineer's notebook feel)

**Reference Inspiration** (for your design work):
- Dieter Rams Braun products (functional beauty)
- Airport departure boards (Solari split-flap displays)
- Vintage Soviet space control panels
- Swiss railway signage (Helvetica, stark, clear)
- NOT: Modern SaaS dashboards, Apple design language, Material Design

---

## Technical Architecture (High-Level)

### Frontend
- **Next.js 14** (App Router for modern routing + server components)
- **Tailwind CSS** (heavily customized with brutalist design tokens)
- **Framer Motion** (for number animations, chart transitions)
- **Zustand** (state management for market data + user preferences)
- **Recharts** (price charts, spread visualizations)

### Backend & Data
- **Supabase** (PostgreSQL + real-time subscriptions + auth)
  - Tables: companies, crude_specs, market_prices, arbitrage_opportunities, alerts, user_preferences
  - Real-time: For live price updates to dashboard
  
- **External APIs**:
  - **EIA (Energy Information Administration)** — Free crude/product prices, updated hourly
  - **Alpha Vantage** — Commodity futures data
  - **Quandl** (optional paid) — Real-time futures (15min delay free)
  
### Data Flow
1. **User inputs** → Company profile, crude specs → Stored in Supabase
2. **Market API poller** → Fetches prices every 15 minutes → Updates Supabase → Triggers dashboard refresh
3. **Arbitrage engine** → Runs calculations every time prices update → Generates opportunities → Stores in DB
4. **Alert engine** → Monitors price thresholds + spread changes → Creates alerts → Pushes to UI
5. **Real-time subscription** → Frontend listens to Supabase changes → Updates dashboard without polling

### Key Files (No Code, Just Structure)
```
/app
  /setup               → Quick 3-minute company profile + crude specs
  /dashboard           → Main trading intelligence screen
  /opportunities       → Deep-dive arbitrage explorer
  /market              → Price tables + crack spreads + contango view
  /alerts              → Alert management
  /api
    /market            → Fetch commodity prices from EIA/Alpha Vantage
    /arbitrage         → Calculate opportunities
    /alerts            → Generate price/spread alerts

/components
  /widgets             → DashboardCard, OpportunityCard, PriceTable
  /ui                  → Base components (Button, Card, Input)
  /charts              → PriceChart, SpreadChart, FuturesCurve
  /calculators         → RefineVsSell, ContangoProfit, QualityArbitrage

/lib
  /domain              → Business logic (arbitrage calcs, crack spreads)
  /api-clients         → Wrappers for EIA, Alpha Vantage
  /store               → Zustand stores (market data, opportunities)
  /utils               → Number formatters, date helpers
```

---

## Feasibility Assessment

### ✅ Highly Feasible
- **Market data APIs**: EIA and Alpha Vantage are free, stable, well-documented
- **Arbitrage calculations**: Pure math, no ML or complex algorithms needed
- **Price alerts**: Simple threshold monitoring, easy to implement
- **Dashboard UI**: Standard React components, custom styling
- **User setup**: Minimal inputs (crude specs + company type)

### ⚠️ Medium Complexity
- **Futures curve data**: Free APIs have delays (15min to EOD), may need paid tier for real-time
- **Quality differentials**: No API for this, need to build logic based on API/sulfur specs
- **Crack spread accuracy**: Simplified model vs. actual refinery economics
- **Real-time updates**: Need to manage API rate limits + caching strategy

### 🔴 Challenges to Address
- **Price data accuracy**: Free APIs are sometimes delayed or missing data points
- **Domain validation**: Arbitrage formulas need to be validated by actual traders
- **Liability**: If calculations are wrong, users could lose money (need disclaimers)
- **Competitive data**: Some price differentials are proprietary (we approximate)

### Realistic MVP Timeline
- **Week 1**: Core UI + setup flow
- **Week 2**: Market API integration + price dashboard
- **Week 3**: Arbitrage detection engine
- **Week 4**: Opportunity explorer + calculators
- **Week 5**: Alert system
- **Week 6**: Polish + demo mode

**Total: 6 weeks to demo-ready trading intelligence platform**

---

---

## Key Trading Concepts & Calculations

### 1. Crude Oil Quality Classification

**API Gravity** (American Petroleum Institute scale)
- Measures density: Higher number = Lighter oil
- **Heavy**: <22° API (thick, tar-like)
- **Medium**: 22-31° API
- **Light**: >31° API (thin, flows easily)

**Sulfur Content**
- Percentage by weight
- **Sweet**: <0.5% sulfur (easy to refine)
- **Sour**: >0.5% sulfur (requires expensive equipment)

**Why it matters:**
- Light Sweet crude = Premium price (high gasoline yield)
- Heavy Sour crude = Discount price (hard to refine)
- Typical differential: $10-25/bbl between light and heavy

**Example:**
- WTI (Light Sweet): API 40°, 0.24% sulfur → $80/bbl
- WCS (Heavy Sour): API 20°, 3.5% sulfur → $60/bbl
- Spread: $20/bbl

---

### 2. Quality Arbitrage (The Money Maker)

**Setup:** You're an integrated company (produce crude + own refinery)

**Scenario:**
- You produce: 10,000 bpd of Light Sweet (API 42°)
- Market price: $82/bbl
- Your refinery: Complex (can handle heavy oil)
- Heavy Sour price: $62/bbl

**Traditional approach:**
- Refine your own crude
- Revenue: Product sales minus crude opportunity cost
- Crack spread: ~$12/bbl

**Arbitrage approach:**
1. **SELL** your Light Sweet at $82/bbl → Revenue: $820K/day
2. **BUY** Heavy Sour at $62/bbl → Cost: $620K/day
3. **Refine** the cheap heavy oil
4. **Net gain:** $20/bbl × 10,000 = **$200K/day extra**

**Formula:**
```
Daily Arbitrage Profit = 
  (Your Crude Price - Discount Crude Price) × Daily Volume
  
= ($82 - $62) × 10,000 bpd
= $200,000/day
= $73 million/year
```

**STRATA shows this automatically when the spread is wide enough.**

---

### 3. Crack Spreads (Refining Margins)

**What it is:** Profit from refining crude into products

**3-2-1 Crack Spread** (industry standard)
- Refine 3 barrels of crude
- Produce 2 barrels gasoline + 1 barrel diesel
- Spread = (2 × gas price) + (1 × diesel price) - (3 × crude price)

**Example:**
- Crude: $80/bbl
- Gasoline: $2.50/gal = $105/bbl (42 gallons/barrel)
- Diesel: $2.80/gal = $117.60/bbl

**Calculation:**
```
Crack Spread = [(2 × $105) + (1 × $117.60)] / 3 - $80
             = [$327.60] / 3 - $80
             = $109.20 - $80
             = $29.20/bbl
```

**Interpretation:**
- Crack spread >$15/bbl = **Strong refining margins** (buy crude, refine)
- Crack spread <$8/bbl = **Weak margins** (maybe don't refine, just trade)
- Crack spread <$0 = **Losing money** (shut down refinery)

**STRATA tracks crack spreads and alerts when margins expand/contract.**

---

### 4. Contango & Backwardation (Storage Plays)

**Contango** = Futures price > Spot price
- Future delivery is worth MORE than today
- **Opportunity:** Buy now, store, sell later

**Example:**
- Spot price today: $80/bbl
- 3-month futures: $88/bbl
- Storage cost: $0.50/bbl/month = $1.50 for 3 months
- **Profit:** $88 - $80 - $1.50 = **$6.50/bbl**

**Backwardation** = Spot price > Futures price
- Today's oil is worth MORE than future delivery
- **Action:** Sell immediately, don't store

**Example:**
- Spot price: $80/bbl
- 3-month futures: $76/bbl
- **Message:** "Market is tight, sell now"

**STRATA shows the futures curve and flags contango opportunities.**

---

### 5. Location Arbitrage (Geographic Spreads)

**Example:**
- WTI (Cushing, Oklahoma): $80/bbl
- LLS (Louisiana Light Sweet, Gulf Coast): $83/bbl
- Transportation cost: $1.50/bbl

**Arbitrage:**
- If you produce in Oklahoma, sell at Gulf Coast
- Gain: $3/bbl - $1.50 transport = **$1.50/bbl net**

**STRATA tracks location spreads when user provides delivery options.**

---

### 6. Price Alert Thresholds

**Absolute alerts:**
- "WTI crosses $85/bbl" (target price)
- "Your crude drops below $75/bbl" (stop loss)

**Spread alerts:**
- "Quality spread widens beyond $25/bbl" (arbitrage opportunity)
- "Crack spread falls below $10/bbl" (margins compressing)

**Volatility alerts:**
- "WTI moves >$3/bbl in 1 hour" (unusual movement)
- "Gasoline spikes 10% in one day" (supply shock)

**STRATA lets users set custom thresholds for all of these.**

---

## API Integration Specifications

### EIA (Energy Information Administration) — FREE
**Endpoint**: `https://api.eia.gov/v2/petroleum/pri/spt/data/`

**What we get:**
- Crude oil spot prices (WTI Cushing, Brent)
- Product prices (gasoline, diesel, heating oil)
- Updated daily (sometimes hourly for spot prices)

**Usage:**
- Fetch every 1 hour
- Cache in Supabase `market_prices` table
- Display on strategy dashboard
- Use in arbitrage calculations

**Rate limits**: 1000 requests/hour (more than enough)

### Alpha Vantage — FREE (with key)
**Endpoint**: `https://www.alphavantage.co/query?function=COMMODITIES`

**What we get:**
- WTI crude futures
- Brent crude futures
- Natural gas prices

**Usage:**
- Complement EIA data
- Fetch every 4 hours
- Used for contango/backwardation detection

**Rate limits**: 25 requests/day (free tier) — need to cache aggressively

### Quandl (Optional Paid)
**Use case**: If customer wants real-time futures data

**Cost**: ~$50/month for commodity data
**Benefit**: 15-minute delayed futures (vs. EOD only on free tiers)

---

## User Input Requirements (Minimal)

### Quick Setup Flow (3 Minutes)

**Step 1: Company Profile**
- Company name (text)
- Company type (dropdown):
  - **Producer**: "We produce crude oil"
  - **Refiner**: "We buy crude and refine it"
  - **Integrated**: "We do both"
  - **Trader**: "We trade but don't own assets"

**Step 2: Production Details** (if Producer or Integrated)
- Daily production volume (number + unit: BPD)
- Crude API gravity (slider: 10° to 50°)
- Sulfur content (slider: 0% to 5%)
- System calculates:
  - Density classification: Heavy / Medium / Light
  - Sweetness: Sweet / Sour
  - Approximate quality differential vs. WTI

**Step 3: Refining Capabilities** (if Refiner or Integrated)
- Daily refining capacity (number + unit: BPD)
- Nelson Complexity Index (dropdown):
  - Simple (1-5): Topping, reforming only
  - Moderate (6-9): Can handle some heavy oil
  - Complex (10+): Can process anything
- Preferred crude types (multi-select):
  - Light Sweet (easiest)
  - Medium Sour
  - Heavy Sour (requires complex refinery)

**Step 4: Market Preferences**
- Primary benchmark (dropdown: WTI / Brent / Dubai / WCS)
- Known quality differential (optional, text: "+$2.50/bbl" or "don't know")
- Storage capacity (optional, number: "500,000 BBL" or "none")
- Enable alerts? (checkbox: Email, SMS, Slack)

**Total input time**: 2-3 minutes

**What we DON'T ask for:**
- No asset inventory (wells, tanks, etc.)
- No geographic locations
- No sensor integrations
- No operational metrics

**Simple rule**: If it doesn't affect trading decisions, we don't ask.

---

## Revenue Model (Future Consideration)

### Freemium
- **Free tier**: Up to 10 assets, daily market data updates, basic alerts
- **Pro ($199/mo)**: Unlimited assets, hourly market data, SMS alerts, arbitrage calculator
- **Enterprise ($999/mo)**: SCADA integration, custom alerts, API access, white-label

### Alternative: Per-Asset Pricing
- $10/asset/month
- Average customer (30 assets) = $300/month
- Large customer (200 assets) = $2,000/month (with volume discounts)

### Value Justification
- If we save an integrated company $50K/day on arbitrage → $1.5M/month
- Our $999/month fee is 0.066% of the value created
- No-brainer ROI

---

## Critical Success Factors

### Must-Haves for Launch
1. **Onboarding completes in <10 minutes** (or users will abandon)
2. **Operations view feels "live"** (simulation must be smooth, not janky)
3. **At least 1 compelling arbitrage opportunity shown** (even if simulated)
4. **UI is distinctive enough** that users say "wow, this doesn't look like Notion/Linear/etc."
5. **Works on iPad** (many field supervisors use tablets)

### Nice-to-Haves
- Mobile app (React Native)
- Slack/Teams integration for alerts
- PDF report generation
- Multi-user with role permissions

### Don't Need for MVP
- Real SCADA integration (mock data is fine)
- Machine learning predictions
- Historical data warehouse
- Complex financial modeling

---

## Risks & Mitigations

### Risk 1: "This is just a dashboard"
**Mitigation**: Focus messaging on DECISIONS, not data. Every screen should answer "What should I do?"

### Risk 2: "Market data could be wrong"
**Mitigation**: Clear disclaimers, show data source + timestamp, allow manual price override.

### Risk 3: "Users won't trust arbitrage suggestions"
**Mitigation**: Show the math. Break down every calculation. Let them toggle assumptions.

### Risk 4: "UI is too weird/different"
**Mitigation**: A/B test with 5-10 potential users. If they hate it, we can soften (but I think they'll love it).

### Risk 5: "Real oil companies won't use a demo tool"
**Mitigation**: Position as "Strategic Planning Tool" not "Operational Control System" until we have real integrations.

---

## Success Metrics

### Setup
- 90% completion rate (users who start setup finish it)
- <3 minutes average time to complete
- 95%+ accuracy on crude classification (Light/Heavy, Sweet/Sour)

### Engagement
- Users check dashboard 2+ times/day
- Average session >3 minutes (reading opportunities, not just glancing)
- 60% of users explore at least 1 opportunity detail per week

### Value Delivery
- 70% of users say they found at least 1 actionable opportunity in first week
- 40% of users report they executed a trade based on STRATA insight
- Average opportunity value shown: >$50K/day

### Design
- >60% of users comment that UI is "different" or "unique"
- <5% complain it's "too complex" or "hard to read"
- 80% say dashboard is "clear at a glance"

---

## What Makes This Special

Most trading intelligence in this industry comes from:
- **Bloomberg terminals** ($25K/year, overwhelming, built for Wall Street not oil companies)
- **Excel spreadsheets** (error-prone, not real-time, siloed)
- **Internal trading desks** (only large companies can afford them)

**STRATA is different:**

**1. Built for Oil People, Not Traders**
- Speaks in barrels, API gravity, crack spreads (not futures contracts and basis swaps)
- Decisions, not data (don't show 100 prices, show "here's what to do")
- Visual, not tabular (charts and cards, not spreadsheets)

**2. Arbitrage Detection, Not Just Price Tracking**
- Doesn't just show "WTI is $80"
- Shows: "Your crude is worth $82.50, but you could make $20/bbl more by swapping grades"
- Calculates profit, shows the math, explains the risk

**3. Real-Time, But Relaxed**
- Updates every 15 minutes (not every second like trading platforms)
- Perfect for commercial teams making daily decisions (not floor traders)
- Fast enough to catch opportunities, slow enough to avoid noise

**4. Brutalist UI**
- The UI alone differentiates us
- Looks serious, professional, utilitarian (not startup-y)
- Oil executives will take it seriously (unlike colorful SaaS dashboards)

**The core insight:** Most oil companies have commercial teams manually doing what STRATA automates. We're replacing a 2-person team with a $199/month tool.

---

## Final Notes for Development Agent

**Tone**: This is serious software for serious financial decisions. Oil trading teams manage millions of dollars. The UI should feel authoritative, not playful. No cutesy copy, no hand-holding.

**Performance**: Trading requires SPEED. Dashboard must load in <1 second. Price updates must be smooth. Calculations instant. Zero lag.

**Accuracy**: If our arbitrage calculation is wrong and a user loses $100K on a bad trade, we're done. Every formula must be validated. Show your work. Let users verify the math.

**Data Transparency**: Always show:
- Where prices came from (EIA, Alpha Vantage)
- When they were last updated
- Calculation methodology (don't hide the formula)
- Confidence levels (if assumptions are made)

**Simplicity Over Features**: 
- Don't build 20 calculators if 3 cover 90% of use cases
- Don't show 50 crude grades if 10 are most common
- Don't add "nice to have" widgets that clutter the dashboard
- Every element must earn its place

**Mobile/Tablet**: This is a desktop-first tool. Commercial teams use laptops. Support iPad as minimum (768px+), but don't optimize for phones.

---

**Build something that looks like it was designed in 1960s Switzerland but calculates arbitrage like 2024 quant traders.**
