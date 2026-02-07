import { MainLayout } from "@/components/layout";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  MetricDisplay,
  PriceIndicator,
  Badge,
  CrudeTypeBadge
} from "@/components/ui";

/**
 * STRATA Homepage - Component Showcase
 * Industrial Brutalism Design System
 * Swiss Railway Signs meets Bloomberg Terminal
 */
export default function Home() {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">
          Component Showcase
        </h1>
        <p className="text-concrete-gray uppercase tracking-wider text-sm">
          Industrial Brutalism Design System — Base Components
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* ===== HERO METRIC - Your Crude Value ===== */}
        <Card className="col-span-6" padding="lg">
          <CardHeader>
            <CardTitle>Your Crude Value</CardTitle>
            <div className="flex gap-2">
              <CrudeTypeBadge type="light" size="sm" />
              <CrudeTypeBadge type="sweet" size="sm" />
            </div>
          </CardHeader>
          <MetricDisplay
            value="$82.50"
            label="Current Market Price"
            unit="/bbl"
            size="xl"
          />
          <div className="mt-4 pt-4 border-t-2 border-black">
            <p className="text-sm text-concrete-gray">
              WTI $80.00 + <span className="text-forest-green font-semibold">$2.50 quality premium</span>
            </p>
          </div>
        </Card>

        {/* ===== BEST OPPORTUNITY ===== */}
        <Card className="col-span-6" variant="highlight" padding="lg">
          <CardHeader>
            <CardTitle>Best Opportunity</CardTitle>
            <Badge variant="success" size="sm">+180K/DAY</Badge>
          </CardHeader>
          <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">
            Quality Arbitrage
          </h3>
          <p className="text-concrete-gray mb-4">
            Sell your Light Sweet crude, buy Mars Sour for refinery processing.
          </p>
          <Button size="lg">View Details →</Button>
        </Card>

        {/* ===== PRICE INDICATORS ROW ===== */}
        <Card className="col-span-3" padding="md">
          <p className="text-xs uppercase tracking-widest text-concrete-gray mb-3">
            WTI CUSHING
          </p>
          <PriceIndicator
            price={80.00}
            change={1.20}
            changePercent={1.52}
            size="md"
          />
        </Card>

        <Card className="col-span-3" padding="md">
          <p className="text-xs uppercase tracking-widest text-concrete-gray mb-3">
            BRENT
          </p>
          <PriceIndicator
            price={83.50}
            change={0.95}
            changePercent={1.15}
            size="md"
          />
        </Card>

        <Card className="col-span-3" padding="md">
          <p className="text-xs uppercase tracking-widest text-concrete-gray mb-3">
            GASOLINE
          </p>
          <PriceIndicator
            price={2.45}
            change={-0.08}
            changePercent={-3.16}
            size="md"
          />
        </Card>

        <Card className="col-span-3" padding="md">
          <p className="text-xs uppercase tracking-widest text-concrete-gray mb-3">
            DIESEL
          </p>
          <PriceIndicator
            price={2.78}
            change={0.12}
            changePercent={4.51}
            size="md"
          />
        </Card>

        {/* ===== METRIC DISPLAYS ===== */}
        <Card className="col-span-4" padding="lg">
          <MetricDisplay
            value="14.50"
            label="3-2-1 Crack Spread"
            unit="$/bbl"
            size="lg"
            trend="up"
          />
          <p className="mt-3 text-xs uppercase tracking-wider text-forest-green font-semibold">
            ▲ STRONG REFINING MARGINS
          </p>
        </Card>

        <Card className="col-span-4" padding="lg">
          <MetricDisplay
            value="10,000"
            label="Daily Production"
            unit="BPD"
            size="lg"
          />
          <p className="mt-3 text-xs uppercase tracking-wider text-concrete-gray">
            LIGHT SWEET CRUDE • API 42°
          </p>
        </Card>

        <Card className="col-span-4" padding="lg">
          <MetricDisplay
            value="+$200K"
            label="Potential Daily Gain"
            size="lg"
            trend="up"
          />
          <p className="mt-3 text-xs uppercase tracking-wider text-forest-green font-semibold">
            FROM QUALITY ARBITRAGE
          </p>
        </Card>

        {/* ===== BUTTON VARIANTS ===== */}
        <Card className="col-span-6" padding="lg">
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg">PRIMARY</Button>
            <Button variant="secondary" size="lg">SECONDARY</Button>
            <Button variant="danger" size="lg">DANGER</Button>
            <Button variant="ghost" size="lg">GHOST</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="primary" size="md">MEDIUM</Button>
            <Button variant="primary" size="sm">SMALL</Button>
            <Button variant="primary" size="lg" disabled>DISABLED</Button>
          </div>
        </Card>

        {/* ===== BADGE VARIANTS ===== */}
        <Card className="col-span-6" padding="lg">
          <CardHeader>
            <CardTitle>Badge Components</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-concrete-gray mb-2">
                CRUDE TYPES
              </p>
              <div className="flex flex-wrap gap-2">
                <CrudeTypeBadge type="light" />
                <CrudeTypeBadge type="heavy" />
                <CrudeTypeBadge type="sweet" />
                <CrudeTypeBadge type="sour" />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-concrete-gray mb-2">
                STATUS INDICATORS
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">DEFAULT</Badge>
                <Badge variant="success">SUCCESS</Badge>
                <Badge variant="warning">WARNING</Badge>
                <Badge variant="danger">DANGER</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* ===== CARD VARIANTS ===== */}
        <Card className="col-span-4" padding="md">
          <CardTitle>Default Card</CardTitle>
          <p className="text-sm text-concrete-gray mt-2">
            White background, 2px black border, sharp corners.
          </p>
        </Card>

        <Card className="col-span-4" variant="highlight" padding="md">
          <CardTitle>Highlight Card</CardTitle>
          <p className="text-sm text-concrete-gray mt-2">
            Industrial yellow border, subtle yellow tint.
          </p>
        </Card>

        <Card className="col-span-4" variant="warning" padding="md">
          <CardTitle>Warning Card</CardTitle>
          <p className="text-sm text-concrete-gray mt-2">
            Safety red border for alerts and warnings.
          </p>
        </Card>

      </div>

      {/* Footer info */}
      <div className="mt-12 pt-6 border-t-2 border-black">
        <p className="text-xs uppercase tracking-widest text-concrete-gray">
          STRATA — Oil Trading Intelligence Platform • Industrial Brutalism Design System
        </p>
      </div>
    </MainLayout>
  );
}
