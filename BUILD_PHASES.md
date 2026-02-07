# STRATA — Build Phases for Trading Intelligence Platform

## How to Build This (Phase by Phase)

---

## Phase 0: Foundation Setup (Start Here)

### What You're Building
The skeleton: Next.js project with brutalist design system, no features yet.

### Prompt for Antigravity:

```
Using the CONTEXT.md file, set up the initial Next.js 14 project:

1. Initialize Next.js 14 with TypeScript and App Router

2. Install and configure Tailwind CSS with "Industrial Brutalism" design tokens:
   - White backgrounds (#FFFFFF)
   - Black text (#000000) 
   - Industrial Yellow (#FFD500), Safety Red (#E60000), Forest Green (#228B22)
   - Monospace font (JetBrains Mono or Geist Mono) for all numbers/data
   - 8px grid system
   - Sharp corners (border-radius: 0)
   - Thick borders (2px solid)
   - NO shadows, NO gradients

3. Create base layout:
   - Sidebar navigation (left side, 240px wide)
   - Top bar with company name placeholder
   - Main content area with subtle grid background

4. Build 5 base UI components (styled only, no functionality):
   - Button (black background, white text, sharp corners)
   - Card (white bg, 2px black border)
   - MetricDisplay (huge monospace number + small label)
   - PriceIndicator (price + green/red arrow for change)
   - Badge (colored label for crude types: Light/Heavy, Sweet/Sour)

5. Create placeholder homepage showing these components

Focus on making it look NOTHING like typical SaaS dashboards.
Think: Swiss railway signs meets Bloomberg terminal.
```

### What to Verify Before Moving On
- [ ] `npm run dev` loads without errors
- [ ] UI looks brutalist (sharp, stark, functional)
- [ ] All 5 components render correctly
- [ ] Monospace font works for numbers
- [ ] NO shadows or gradients anywhere

---

## Phase 1: Quick Setup Flow

### What You're Building
Single-page setup form to capture company profile and crude specs.

### Prompt for Antigravity:

```
Build the setup page at /app/setup:

1. Create a single-page form with 4 sections (NOT a multi-step wizard):

   **Section 1: Company Profile**
   - Text input: Company name
   - 4 large selection cards for company type:
     * Producer (we produce crude)
     * Refiner (we buy crude and refine it)
     * Integrated (we do both)
     * Trader (we trade without assets)
   
   **Section 2: Production Details** (show only if Producer or Integrated)
   - Number input: Daily production (BPD)
   - Slider: API Gravity (10° to 50°)
   - Slider: Sulfur Content (0% to 5%)
   - Live display: Auto-calculate crude classification
     Example: "API 42°, Sulfur 0.3% = Light Sweet Crude"
   
   **Section 3: Refining Capabilities** (show only if Refiner or Integrated)
   - Number input: Daily capacity (BPD)
   - Dropdown: Nelson Complexity Index
     * Simple (1-5): Basic processing
     * Moderate (6-9): Can handle some heavy oil
     * Complex (10+): Can process anything
   - Checkboxes: Preferred crude types (Light Sweet, Medium, Heavy Sour)
   
   **Section 4: Market Settings**
   - Dropdown: Primary benchmark (WTI, Brent, Dubai, WCS)
   - Optional text input: Known quality differential ("+$2.50/bbl")
   - Optional number input: Storage capacity in barrels
   - Checkboxes: Alert preferences (Email, SMS, Slack)

2. Use Zustand to store all inputs (auto-save on every change)

3. Crude classification logic:
   - API <22 = Heavy, 22-31 = Medium, >31 = Light
   - Sulfur <0.5% = Sweet, >0.5% = Sour
   - Update instantly as user moves sliders

4. "Complete Setup" button at bottom:
   - Validate: Company type + name are required
   - Production/Refining sections required based on type
   - Log complete profile to console
   - Redirect to /dashboard

5. Design requirements:
   - All on white background
   - Section headers in bold black, 24px
   - Slider values displayed in HUGE monospace (72px)
   - Classification result in Forest Green if valid
   - Required field errors in Safety Red
   - Tight spacing (dense layout, not spacious)

DO NOT connect to backend yet. Just local Zustand state.
```

### What to Verify Before Moving On
- [ ] Form saves to Zustand on every input
- [ ] Conditional sections appear/hide correctly
- [ ] Crude classification updates live as sliders move
- [ ] Can complete setup in <2 minutes
- [ ] Console logs complete profile data

---

## Phase 2: Market Data Integration

### What You're Building
Connect to EIA API and display live crude oil prices.

### Prompt for Antigravity:

```
Integrate the EIA API for live market data:

1. Create API route at /app/api/market/route.ts:
   - Fetch from EIA API (free tier):
     * WTI Cushing spot price
     * Brent spot price
     * Gasoline RBOB price
     * Diesel No. 2 price
   - Cache responses for 15 minutes (respect rate limits)
   - Return JSON with prices + timestamp

2. Create API route at /app/api/market/calculate-differentials/route.ts:
   - Takes user's crude specs (API, sulfur)
   - Calculates approximate quality differential
   - Formula approximation:
     * Light premium: (API - 30) × $0.50/degree
     * Sweet premium: (0.5 - Sulfur%) × $10/point
   - Returns user's crude value vs. WTI

3. Create a Market Prices widget component:
   - Shows 4 key prices in a 2×2 grid
   - Each price cell has:
     * Label (small, uppercase, gray)
     * Price (huge monospace, black)
     * Change (green arrow up / red arrow down + amount)
     * Unit ("$/bbl" or "$/gal")
   - "Last updated: X minutes ago" at bottom

4. Add widget to /dashboard page

5. Use SWR or React Query for data fetching:
   - Fetch on mount
   - Refresh every 15 minutes
   - Show loading state (gray boxes, no spinners)
   - Show error state ("Market data unavailable")

EIA API endpoint: https://api.eia.gov/v2/petroleum/pri/spt/data/
Free API key required (register at eia.gov).

Design: Keep it minimal. Just numbers. No charts yet.
```

### What to Verify Before Moving On
- [ ] Market prices load on dashboard
- [ ] Prices update every 15 minutes
- [ ] Error handling works (disable network to test)
- [ ] Change indicators show correct color
- [ ] Timestamp displays correctly

---

## Phase 3: Dashboard Layout

### What You're Building
The main trading intelligence dashboard with 4 key widgets.

### Prompt for Antigravity:

```
Build the main dashboard at /app/dashboard:

1. Layout: 2×2 grid of widgets (equal size)

   **Widget 1: Your Crude Value (Top Left)**
   - Hero metric: User's crude price in huge numbers (96px monospace)
   - Calculation: WTI + quality differential
   - Example: "$82.50/bbl"
   - Subtext: "WTI $80.00 + $2.50 quality premium"
   - Change from yesterday (green/red with arrow)
   
   **Widget 2: Best Opportunity (Top Right)**
   - Shows highest-value opportunity currently available
   - Placeholder for now: "Quality Arbitrage: +$180K/day"
   - Brief description: "Sell your crude, buy Mars for refinery"
   - "View Details →" button (links to /opportunities)
   
   **Widget 3: Market Overview (Bottom Left)**
   - The market prices widget from Phase 2
   - 4 prices: WTI, Brent, Gasoline, Diesel
   
   **Widget 4: Quick Calculator (Bottom Right)**
   - Dropdown: Select scenario type
     * "Refine vs. Sell"
     * "Storage Economics" 
     * "Quality Swap"
   - Based on selection, show 2-3 input fields
   - "Calculate" button
   - Result displayed below in green (if profit) or red (if loss)

2. Sidebar navigation should have links to:
   - Dashboard (current page)
   - Opportunities
   - Market Intelligence
   - Alerts
   - Settings

3. Top bar should display:
   - Company name (from setup)
   - Crude type badge (e.g., "Light Sweet Producer")
   - Live indicator (green dot + "LIVE")

4. Design requirements:
   - Each widget is a white card with 2px black border
   - 24px padding inside widgets
   - 16px gap between widgets
   - Widget headers: 18px bold black
   - All numbers in monospace
   - No widget should have scroll (all content fits)

All data should come from Zustand (setup data + market data).
Quick calculator can show placeholder results for now.
```

### What to Verify Before Moving On
- [ ] Dashboard loads with all 4 widgets
- [ ] Crude value calculates correctly from WTI + differential
- [ ] Navigation links work
- [ ] Top bar shows company info
- [ ] Grid is responsive (stacks on tablet)

---

## Phase 4: Arbitrage Detection Engine

### What You're Building
The core intelligence: detect quality arbitrage opportunities.

### Prompt for Antigravity:

```
Build the arbitrage detection system:

1. Create calculation logic at /lib/domain/arbitrage.ts:

   **Quality Arbitrage Calculator:**
   - Input: User's crude specs, current market prices
   - Logic:
     * If user is Integrated (produces + refines):
       - Can sell own crude at premium price
       - Can buy discount crude for refining
       - Opportunity = (Premium Price - Discount Price) × Daily Volume
     
     * Example calculation:
       - User produces Light Sweet: $82/bbl
       - Heavy Sour available: $62/bbl
       - User refines 10,000 bpd
       - Opportunity: ($82 - $62) × 10,000 = $200,000/day
   
   - Output: Opportunity object with:
     * Type: "Quality Arbitrage"
     * Description: "Sell Light Sweet, buy Heavy Sour"
     * Daily profit: $200,000
     * Confidence: 85% (based on spread vs. historical average)
     * Risks: ["Spread could narrow", "Storage logistics required"]

2. Create API route at /app/api/arbitrage/detect/route.ts:
   - Fetches user's profile from Zustand/DB
   - Fetches current market prices
   - Runs arbitrage calculations
   - Returns array of opportunities (sorted by profit)

3. Update Dashboard Widget 2 to show real opportunity:
   - Call /api/arbitrage/detect on mount
   - Display highest-value opportunity
   - Format profit with commas: "$200,000/day"
   - Color profit number in Forest Green

4. For now, focus ONLY on quality arbitrage:
   - Temporal arbitrage (contango) = Phase 5
   - Location arbitrage = Future phase

5. Handle edge cases:
   - If user is Producer-only: Show "Integrate refining to unlock opportunities"
   - If spread is too narrow (<$10/bbl): Show "No opportunities detected"
   - If API call fails: Show "Unable to calculate opportunities"

Formula from CONTEXT.md "Key Trading Concepts" section.
Show your math in the opportunity detail.
```

### What to Verify Before Moving On
- [ ] Opportunity calculates correctly for Integrated companies
- [ ] Profit number shows in correct format
- [ ] Widget shows "No opportunities" when not applicable
- [ ] Confidence % displays correctly
- [ ] Edge cases handled (non-integrated users, API failures)

---

## Phase 5: Opportunity Explorer

### What You're Building
Deep-dive page showing arbitrage opportunity details.

### Prompt for Antigravity:

```
Build the Opportunity Explorer at /app/opportunities:

1. Layout:
   - Left side (60%): List of opportunities (cards)
   - Right side (40%): Selected opportunity detail

2. Opportunity Card (Left):
   - Type badge (colored: "Quality Arbitrage" in green)
   - Title: Brief description
   - Profit: Big number in monospace
   - Confidence bar (visual progress bar)
   - Click to select (highlight with thicker border)

3. Detail Panel (Right):
   
   **Section 1: The Math**
   - Show calculation breakdown:
     ```
     Your Production:  10,000 bpd × $82.50 = $825,000/day
     Alternative Buy:  10,000 bpd × $62.00 = $620,000/day
                      ________________________________
     Net Gain:                            $205,000/day
     ```
   - Use monospace font for numbers
   - Right-align numbers (accounting style)
   
   **Section 2: The Trade**
   - Action 1: "Sell your Light Sweet → Gulf Coast buyer"
   - Action 2: "Buy Heavy Sour (Mars/WCS) → Deliver to refinery"
   - Logistics: "Requires 500K BBL storage + 2 week lead time"
   - Risks: List of 2-3 risk factors
   
   **Section 3: Sensitivity**
   - Interactive slider: "What if spread narrows to $X?"
   - Live calculation update as slider moves
   - Break-even point: "Profitable down to $12/bbl spread"
   
   **Section 4: Actions**
   - "Set Alert" button → Alert me if spread narrows to X
   - "Save Scenario" button → Bookmark for later
   - "Export PDF" button (future phase, can be disabled)

4. If no opportunity selected:
   - Show empty state: "Select an opportunity to view details"

5. Design:
   - Opportunity cards: White bg, 2px black border
   - Selected card: 4px black border (double thickness)
   - Detail panel: Fixed position (doesn't scroll with cards)
   - Math section: Use <pre> tag for alignment

Load opportunities from /api/arbitrage/detect endpoint.
Allow clicking cards to select different opportunities.
```

### What to Verify Before Moving On
- [ ] Opportunity cards display correctly
- [ ] Clicking card shows detail on right
- [ ] Math calculation is formatted correctly
- [ ] Sensitivity slider updates calculation live
- [ ] Empty state shows when nothing selected

---

## Phase 6: Market Intelligence Page

### What You're Building
Comprehensive view of market data and spreads.

### Prompt for Antigravity:

```
Build the Market Intelligence page at /app/market:

1. Layout: 3 sections (vertically stacked)

   **Section 1: Price Table**
   - Table showing all major crude benchmarks:
     | Grade       | Price   | Change  | vs. WTI |
     |-------------|---------|---------|---------|
     | WTI Cushing | $80.00  | +$1.20  | --      |
     | Brent       | $83.50  | +$0.95  | +$3.50  |
     | LLS         | $82.50  | +$1.10  | +$2.50  |
     | Mars        | $76.00  | +$0.80  | -$4.00  |
     | WCS         | $62.00  | +$0.50  | -$18.00 |
   
   - Use monospace for all numbers
   - Color "Change" column: green if positive, red if negative
   - Right-align numbers
   
   **Section 2: Crack Spreads**
   - Show 3-2-1 crack spread calculation
   - Simplified formula:
     * Crack Spread = (2 × Gas Price + 1 × Diesel Price) / 3 - Crude Price
   - Display result with interpretation:
     * >$15/bbl: "Strong refining margins" (green)
     * $8-15/bbl: "Moderate margins" (yellow)
     * <$8/bbl: "Weak margins" (red)
   
   **Section 3: Futures Curve** (Simple version)
   - Show spot price vs. 3-month futures
   - Calculate contango/backwardation:
     * If Futures > Spot: "Contango: $X/bbl" (storage profitable)
     * If Spot > Futures: "Backwardation: $X/bbl" (sell now)
   - Simple line chart showing the curve
   
2. Data sources:
   - Use /api/market endpoint from Phase 2
   - For futures: Use Alpha Vantage API or hardcoded demo data
   - For quality differentials: Calculate from API/sulfur specs

3. Refresh button:
   - Top right corner
   - "Last updated: X minutes ago"
   - Click to force refresh

4. Design:
   - Table: Black borders, white background
   - Headers: Bold, uppercase, 12px
   - Rows: 16px padding
   - Alternate row background: Very light gray (#FAFAFA)

All prices should be pulled from real APIs.
Futures can use demo/hardcoded data if free API unavailable.
```

### What to Verify Before Moving On
- [ ] Price table displays all benchmarks
- [ ] Differentials calculate correctly
- [ ] Crack spread shows with interpretation
- [ ] Contango/backwardation displays
- [ ] Refresh button updates data

---

## Phase 7: Alert System

### What You're Building
Notification system for price changes and opportunities.

### Prompt for Antigravity:

```
Build the alert detection and management system:

1. Create alert rules engine at /lib/domain/alerts.ts:

   **Price Threshold Alerts:**
   - "WTI crosses $85/bbl" (target price hit)
   - "Your crude drops below $75/bbl" (stop loss)
   
   **Spread Alerts:**
   - "Quality spread widens beyond $25/bbl" (arbitrage opportunity)
   - "Crack spread falls below $10/bbl" (margins compressing)
   
   **Volatility Alerts:**
   - "WTI moves >$3/bbl in 1 hour" (unusual movement)

2. Create API route at /app/api/alerts/check/route.ts:
   - Runs every time market data updates (every 15 min)
   - Checks all active alert rules
   - Creates new alerts if conditions met
   - Stores in Supabase alerts table (or Zustand for now)

3. Create Alerts page at /app/alerts:
   
   **Alert List:**
   - Each alert shows:
     * Severity indicator (dot: red/yellow/green)
     * Alert type (Price / Spread / Opportunity)
     * Message: "WTI crossed $85.00/bbl"
     * Timestamp: "5 minutes ago"
     * Acknowledge button
   
   **Filters:**
   - All / Unacknowledged / Acknowledged
   - Critical / Warning / Info
   
   **Alert Creation:**
   - "New Alert Rule" button
   - Form: Select type, set threshold, choose notification method
   - Save to user preferences

4. Add alert badge to sidebar:
   - Red circle with count of unacknowledged alerts
   - Visible from any page

5. Toast notifications:
   - Use Sonner library for in-app toasts
   - Show toast for new critical alerts
   - Don't block UI (non-modal)

For now, store alerts in Zustand.
Phase 8 will add Supabase persistence.
```

### What to Verify Before Moving On
- [ ] Alerts generate when thresholds hit
- [ ] Alert list shows all alerts correctly
- [ ] Can filter by status/severity
- [ ] Badge count updates correctly
- [ ] Toast appears for new critical alerts

---

## Phase 8: Supabase Backend

### What You're Building
Replace local state with database persistence.

### Prompt for Antigravity:

```
Migrate from Zustand-only to Supabase:

1. Set up Supabase project:
   - Create tables:
     * companies (id, name, type, created_at)
     * crude_specs (company_id, api_gravity, sulfur, daily_volume, ...)
     * refinery_specs (company_id, capacity, complexity_index, ...)
     * market_prices (timestamp, commodity, price, change)
     * arbitrage_opportunities (company_id, type, profit, confidence, ...)
     * alerts (company_id, type, message, severity, acknowledged, ...)
   
   - Enable Row Level Security (RLS)
   - Add auth (email + password for now)

2. Update /app/setup to save to Supabase:
   - On "Complete Setup" click:
     * Create company record
     * Create crude_specs record
     * Create refinery_specs record (if applicable)
   - Redirect to /dashboard

3. Update /app/dashboard to fetch from Supabase:
   - Load company + specs on mount
   - Calculate crude value from specs + market data
   - Show loading state while fetching

4. Update /app/api/market to save prices to Supabase:
   - Every fetch from EIA:
     * Save to market_prices table
     * Include timestamp
   - Frontend reads from Supabase instead of API directly

5. Add Supabase Real-time:
   - Subscribe to market_prices table changes
   - Update dashboard automatically when prices change
   - No need to poll every 15 minutes

6. Add authentication:
   - Simple email + password signup/login
   - Redirect logged-out users to /login
   - Redirect first-time users to /setup
   - Redirect existing users to /dashboard

Keep UI exactly the same.
This is a backend swap, not a redesign.
```

### What to Verify Before Moving On
- [ ] Can create account and login
- [ ] Setup saves to database correctly
- [ ] Dashboard loads from Supabase
- [ ] Real-time updates work (test with 2 browser tabs)
- [ ] Data persists after logout/login

---

## Phase 9: Polish & Edge Cases

### What You're Building
Production-ready error handling and loading states.

### Prompt for Antigravity:

```
Add production polish to all pages:

1. Loading States:
   - Skeleton loaders for all data fetches
   - Use gray rectangles (no shimmer animations)
   - Match the shape of actual content
   - Example: Price widget shows 4 gray boxes while loading

2. Empty States:
   - Dashboard with no setup: "Complete setup to view opportunities"
   - Opportunities with no opportunities: "No arbitrage detected at current spreads"
   - Market page with API failure: "Unable to load market data. Retrying..."
   - Use simple black text, no illustrations

3. Error States:
   - API failures: "Unable to load prices. Check connection."
   - Database errors: "Connection lost. Retrying..."
   - Invalid inputs: "API gravity must be between 10-50°"
   - Show errors in Safety Red (#E60000)
   - Provide retry button where applicable

4. Mobile/Tablet Responsiveness:
   - Tablet (768px+): Stack widgets vertically
   - Mobile (not required): Show message "Use desktop for full experience"
   - Sidebar: Collapse to hamburger menu on mobile

5. Performance:
   - Lazy load routes (use Next.js dynamic imports)
   - Optimize images (use Next.js Image component)
   - Debounce calculations (if >3 opportunities, don't recalc on every slider move)

DO NOT support mobile phones (<768px).
Tablet is minimum viable screen size.
```

### What to Verify Before Moving On
- [ ] No blank screens anywhere (always show loading or empty state)
- [ ] All errors handled gracefully
- [ ] Works on iPad (768px width)
- [ ] Loads in <2 seconds
- [ ] No console errors

---

## Phase 10: Demo Mode

### What You're Building
Pre-loaded demo data for showcasing the product.

### Prompt for Antigravity:

```
Create demo mode for product showcase:

1. Add "Load Demo" feature:
   - Button in settings: "Load Demo Company"
   - Creates sample integrated oil company:
     * Name: "Apex Energy (Demo)"
     * Type: Integrated
     * Production: 10,000 bpd Light Sweet (API 42°, 0.3% sulfur)
     * Refinery: 10,000 bpd capacity, Complex (NCI 11)
   - Pre-populates all data

2. Demo ensures always shows opportunities:
   - Calculate quality arbitrage using real WTI price
   - Use hardcoded discount crude: WTI - $20/bbl
   - Ensures spread is always wide enough to show opportunity
   - Show at least 1 high-value opportunity ($150K+ /day)

3. Create landing page at / (public, no auth):
   - Hero section:
     * Headline: "Real-time arbitrage detection for oil & gas"
     * Subheadline: "Find $200K/day opportunities hidden in quality spreads"
     * Screenshot of dashboard
   
   - Two CTA buttons:
     * "Try Demo" → /dashboard?demo=true (loads demo data, no login)
     * "Get Started" → /signup
   
   - Keep landing page brutalist:
     * White background
     * Bold black headlines (48px)
     * No marketing fluff
     * Single screenshot
     * Two buttons

4. Demo banner:
   - Yellow bar at top when in demo mode
   - Text: "Viewing demo data. Sign up to create your own company."
   - Close button (exits demo mode)

5. Demo mode should NOT require authentication:
   - Use URL param: ?demo=true
   - Store demo data in sessionStorage
   - Clear on close or page refresh

Keep landing page SIMPLE.
1 hero headline + 1 screenshot + 2 buttons = done.
No feature lists, no testimonials, no pricing tables.
```

### What to Verify Before Moving On
- [ ] Demo loads instantly (no signup required)
- [ ] Demo data looks realistic
- [ ] Always shows at least 1 opportunity
- [ ] Landing page is clean and minimal
- [ ] Demo banner shows/hides correctly

---

## How to Use These Prompts

### For Each Phase:

1. **Copy the exact prompt** from the phase
2. **Paste into Antigravity**
3. **Wait for build** (5-30 minutes per phase)
4. **Verify using checklist**
5. **Fix issues before next phase**

### Phase Timing (Estimates):

- Phase 0: 30 minutes (foundation)
- Phase 1: 1 hour (setup form)
- Phase 2: 1 hour (market API)
- Phase 3: 1 hour (dashboard layout)
- Phase 4: 2 hours (arbitrage engine)
- Phase 5: 1.5 hours (opportunity explorer)
- Phase 6: 1.5 hours (market intelligence)
- Phase 7: 1.5 hours (alerts)
- Phase 8: 2-3 hours (Supabase migration)
- Phase 9: 1 hour (polish)
- Phase 10: 1 hour (demo mode)

**Total: ~13-15 hours of focused building**

---

## Pro Tips

1. **Start with Phase 0** — Get the design system right first
2. **Don't skip verification** — Each phase builds on the last
3. **Use real APIs early** — Don't mock EIA data, actually integrate it
4. **Test on tablet** — Keep iPad simulator open
5. **Keep it simple** — If tempted to add features, don't

---

## When You're Done

You'll have:
- ✅ 3-minute setup flow
- ✅ Real-time market data from EIA
- ✅ Quality arbitrage detection
- ✅ Opportunity deep-dives
- ✅ Price alerts
- ✅ Demo mode for sharing
- ✅ Unique brutalist UI

**Share the demo link. Get user feedback. Iterate.**
