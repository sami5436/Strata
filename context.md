# STRATA — Vertical Integration Intelligence Platform
## Context Document for Development Agent

---

## What We're Actually Building

A **live intelligence dashboard** for oil & gas companies that shows them two things they've never seen in real-time:

1. **"Your tank is about to overflow, throttle Well 3 now"** (Operational)
2. **"You could make $200K today by selling your crude and buying cheaper oil for your refinery"** (Strategic)

This isn't a data warehouse. This isn't a BI tool. This is a **real-time decision engine** that turns physical asset data + market data into money-making (or money-saving) actions.

---

## The Core Insight (Why This Matters)

Most oil companies have:
- **Wells** producing crude oil
- **Tanks** storing it
- **Pipelines** moving it
- **Refineries** processing it (if they're integrated)

But their systems don't talk to each other. They're looking at:
- Well production in one system
- Tank levels in Excel
- Market prices on Bloomberg
- Refinery operations in yet another system

**STRATA connects the dots.** It's the first tool that says: "Your physical assets + today's market prices = here's what you should do right now."

---

## Who Uses This

### Primary: Integrated Oil Companies
Companies that own the full chain: production → storage → refining

**Example User**: Operations Manager at a mid-size integrated company
- Has 20 wells producing light sweet crude ($80/bbl)
- Has a complex refinery that can process cheap heavy oil ($60/bbl)
- **Today they're losing $20/bbl** by refining their own oil instead of selling it

### Secondary: Pure Upstream Producers
Companies that only produce crude oil

**Example User**: Production Superintendent
- Manages 50 wells feeding into 10 field tanks
- Needs to know: "Which wells should I shut in when Tank 7 hits 90%?"
- Wants to optimize: "Should I sell now at $78 or store for next month at $82?"

### Tertiary: Midstream/Storage Operators
Companies that store and transport oil for others

**Example User**: Terminal Manager
- Has 500,000 barrels of storage capacity
- Sees: "Crude futures are $5 higher in 3 months" (contango)
- Opportunity: Fill storage now, sell later

---

## The User Journey (Business Flow)

### Phase 1: Onboarding (5 Minutes)
**Goal**: Map the customer's physical reality into the system

**User does:**
1. **Selects company type**: Upstream / Midstream / Downstream / Integrated
2. **Adds assets**: "I have 15 wells, 3 tanks, 1 refinery"
3. **Defines connections**: "Wells 1-5 feed into Tank A"
4. **Sets crude specs**: "We produce API 42°, Sulfur 0.3% (Light Sweet)"

**System does:**
- Creates a graph of their asset network
- Starts pulling live market prices for their crude grade
- Begins calculating arbitrage opportunities
- Sets up alert thresholds (tank levels, pressure, etc.)

**Critical Feasibility**: 
- User should NOT have to input sensor data manually
- We generate mock telemetry for demo/testing
- In production, they'd connect their SCADA/IoT feeds via API (future phase)

---

### Phase 2: The Operations View (The "Now" Screen)
**Goal**: See what's happening physically, right now

**User sees:**
- **Asset map**: Visual flowchart of their wells → tanks → pipelines → refinery
- **Live metrics**: Flow rates, tank levels, pressures (updating every few seconds)
- **Status indicators**: Green (normal), Yellow (warning), Red (critical)
- **Active alerts**: "Tank B at 92% — Recommend shutting in Well 7"

**Business value:**
- Prevent spills/overflows (regulatory fines = $10K-$1M)
- Optimize production (shutting in the right well vs. the wrong one = $5K/day)
- Reduce manual monitoring (1 supervisor can watch 50 assets instead of 10)

**Feasibility notes:**
- Mock simulation for demo: Tank levels gradually increase, wells fluctuate ±5%
- Real production: Integrate with OPC UA, MQTT, or REST APIs from SCADA systems
- Update frequency: 1-5 seconds for smooth "live" feeling

---

### Phase 3: The Strategy View (The "Money" Screen)
**Goal**: See arbitrage opportunities, make more money

**User sees:**
- **Opportunity cards**: Ranked by $/day profit potential
  - Example: "Sell your crude, buy discount oil → +$180K/day"
  - Example: "Store oil for 3 months (contango play) → +$2.5M total"
  - Example: "Derivative arbitrage opportunity → +$100K/day (most important example)"
- **Market dashboard**: Live prices for WTI, Brent, gasoline, diesel
- **Crack spread calculator**: "Your refinery margin is $12/bbl today (good)"
- **Scenario modeling**: "What if I divert 50% of production to open market?"

**Business value:**
- **Quality Arbitrage**: Integrated companies typically leave $50K-$500K/day on the table
- **Temporal Arbitrage**: Contango storage plays can add $5-20/bbl
- **Location Arbitrage**: Selling in premium markets vs. local buyers

**Feasibility — Real Data Sources:**

| Data Type | API Source | Update Frequency |
|-----------|------------|------------------|
| Crude prices (WTI, Brent) | EIA API (free) or Alpha Vantage | Daily / Hourly |
| Futures prices | Quandl or IEX Cloud | Real-time (15min delay free) |
| Product prices (gas, diesel) | EIA Petroleum Data | Weekly |
| Crack spreads | Calculate from above | On-demand |
| Sulfur/Quality differentials | Manual config (user sets typical spread) | Static |

**Critical**: We do NOT need paid Bloomberg terminals. Free/affordable APIs are sufficient for 90% of use cases.

---

### Phase 4: The Alert Center (The "Action" Screen)
**Goal**: Don't make users hunt for problems, push them

**User sees:**
- **Critical alerts** (red): "Tank overflow imminent — 15 minutes to action"
- **Warnings** (yellow): "Well 12 pressure dropping — check for issues"
- **Opportunities** (green): "Crack spread widened — refining margin +$3/bbl today"

**Interaction:**
- Click alert → See recommended action → Execute (or dismiss)
- Example: "Shut in Well 7" → One-click command (if SCADA integrated) or manual note

**Feasibility:**
- Alerts generated from:
  1. Threshold rules (tank > 90%)
  2. Trend analysis (pressure dropping 10% in 1 hour)
  3. Economic triggers (price differential > $5/bbl)
- Delivery: In-app notifications, SMS (Twilio), email, Slack webhooks

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
- **Tailwind CSS** (but heavily customized with our brutalist design tokens)
- **Framer Motion** (for physical animations: liquid filling, needle movements)
- **Zustand** (state management for asset graph)
- **Recharts** (data visualization, but styled to match our aesthetic)

### Backend & Data
- **Supabase** (PostgreSQL + real-time subscriptions + auth)
  - Tables: companies, assets, asset_connections, telemetry, alerts, arbitrage_opportunities
  - Real-time: For live telemetry updates to dashboard
  
- **External APIs**:
  - EIA (Energy Information Administration) — Free crude/product prices
  - Alpha Vantage — Commodity data
  - Quandl — Futures/derivatives (use the free tier. we could also calculate contango/backwardation ourselves.)
  
### Data Flow
1. **User inputs** → Company info, asset specs → Stored in Supabase
2. **Mock telemetry** → Simulated sensor data → Updates Zustand store → Triggers UI animations
3. **Market APIs** → Price fetching every 1 hour → Stored in Supabase → Triggers arbitrage recalculation
4. **Alert engine** → Runs every 30 seconds → Checks thresholds → Creates alerts → Pushes to UI

### Key Files (No Code, Just Structure)
```
/app
  /onboarding        → 4-step wizard
  /operations        → Main dashboard (asset view)
  /strategy          → Arbitrage opportunities
  /alerts            → Alert management
  /api
    /market          → Fetch commodity prices
    /arbitrage       → Calculate opportunities
    /simulation      → Generate mock telemetry

/components
  /assets            → AssetCard, TankVisual, WellCard, etc.
  /ui                → Base components (Button, Card, etc.)
  /charts            → Custom styled charts
  /wizard            → Onboarding flow

/lib
  /domain            → Business logic (arbitrage calcs, flow physics)
  /api-clients       → Wrappers for EIA, Alpha Vantage
  /store             → Zustand stores
```

---

## Feasibility Assessment

### ✅ Highly Feasible
- **Mock simulation**: Easy. Generate random variance for demos.
- **Market data**: Free APIs cover 90% of needs.
- **Asset graph**: Standard directed graph, well-understood problem.
- **Alerts**: Simple threshold + event system.
- **UI**: Custom but not technically complex, just design-intensive. no emojis.

### ⚠️ Medium Complexity - we will work on this later. dont focus o this
- **Real SCADA integration**: Requires customer's IT to expose APIs (phase 2 feature).
- **Arbitrage algorithms**: Need domain expertise to refine formulas (but we have basics).
- **Real-time updates**: Supabase handles this well, but need to test at scale.

### 🔴 Challenges to Address
- **Data accuracy**: Mock data is fine for demo, but real customers need real sensors.
- **Domain validation**: Need actual O&G operators to validate assumptions.
- **Regulatory compliance**: If handling real operations, need to consider safety certifications.

### Realistic MVP Timeline
- **Week 1-2**: Core UI + onboarding wizard
- **Week 2-3**: Operations dashboard with mock data
- **Week 3-4**: Market API integration + arbitrage detection
- **Week 4-5**: Alert system + polishing
- **Week 6**: Demo-ready product

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

### Quandl (use the free version tho)
**Use case**: If customer wants real-time futures data

**Cost**: ~$50/month for commodity data
**Benefit**: 15-minute delayed futures (vs. EOD only on free tiers)

---

## User Input Requirements (Minimal)

### Onboarding Wizard Input
**Step 1: Company Profile**
- Company name (text)
- Company type (dropdown: Upstream/Midstream/Downstream/Integrated)
- Annual production target (optional, for benchmarking)

**Step 2: Asset Inventory**
For each asset:
- Asset name (text: "Well A", "Tank 1", "Refinery Houston")
- Asset type (dropdown: Well, Tank, Pipeline, LACT Unit, Refinery)
- Capacity (number: "500 BPD", "10,000 BBL", etc.)

**Step 3: Asset Connections**
- Visual graph builder: "Drag from Well 1 to Tank A"
- System auto-validates (no cycles, logical flow)

**Step 4: Crude Quality** (only for Upstream/Integrated)
- API Gravity (number: 20-50°)
- Sulfur Content (number: 0-5%)
- System calculates: Light/Medium/Heavy, Sweet/Sour

**Step 5: Market Benchmark**
- Select primary benchmark (dropdown: WTI, Brent, Dubai, WCS)
- Set typical differential (number: +/- $/bbl vs benchmark)

**Total input time**: 5-10 minutes for a small company (10-20 assets)

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

### Nice-to-Haves (later)
- Mobile app (React Native) 
- Slack/Teams integration for alerts (later)
- PDF report generation (later)
- Multi-user with role permissions (later)

### Don't Need for MVP
- Real SCADA integration (mock data is fine)
- Machine learning predictions (we could do this later)
- Historical data warehouse (we could do this later)
- Complex financial modeling (we could do this later)

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

### Onboarding
- 80% completion rate (users who start wizard finish it)
- <10 minutes average time to complete

### Engagement
- Users check dashboard 3+ times/day
- Average session length >5 minutes (they're actually reading, not just glancing)

### Value Delivery
- 70% of users say they found at least 1 actionable insight
- 30% of users report taking action based on an alert/opportunity

### Design
- >50% of users comment on UI being "different" or "unique" (in feedback)

---

## What Makes This Special

Most software in this industry is:
- Built by oil engineers (clunky, ugly, hard to use)
- Or built by software companies (pretty but doesn't understand the domain)

**STRATA is both:**
- Deep domain understanding (we know what API gravity is)
- Modern software UX (smooth, fast, intuitive)
- Unique visual identity (not another generic SaaS)

The UI alone will get us in the door. The arbitrage detection will keep them paying.

---

## Final Notes for Development Agent

**Tone**: This is serious software for serious people making serious money decisions. No playful illustrations, no hand-holding microcopy. Respect the user's intelligence.

**Performance**: Industrial systems are expected to be RELIABLE. 99.9% uptime, <1s load times, zero crashes.

**Accuracy**: If a user acts on our arbitrage suggestion and loses money because our calc was wrong, we're dead. Double-check all formulas.

**Data Privacy**: Oil production data is commercially sensitive. Assume everything is confidential. Plan for SOC2 compliance eventually.

---

**Go build something that looks like it was designed in 1960s Switzerland but works like 2024 AI software.**
