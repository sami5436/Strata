"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

/**
 * Public Landing Page - Industrial Brutalism Style
 * Marketing page for Strata with dashboard preview and sign up CTAs
 * Fully responsive for mobile, tablet, and desktop
 */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBeginnerGuide, setShowBeginnerGuide] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black text-white z-50 flex items-center justify-between px-4 md:px-8 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white flex items-center justify-center">
            <span className="text-black font-mono font-bold text-lg md:text-xl">S</span>
          </div>
          <div>
            <span className="font-mono font-bold text-xl md:text-2xl tracking-tighter">STRATA</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm uppercase tracking-wider hover:text-industrial-yellow transition-colors">
            Features
          </Link>
          <Link href="#methodology" className="text-sm uppercase tracking-wider hover:text-industrial-yellow transition-colors">
            Methodology
          </Link>
          <Link href="#pricing" className="text-sm uppercase tracking-wider hover:text-industrial-yellow transition-colors">
            Pricing
          </Link>
          <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white border-white hover:bg-white hover:text-black">
                Log In
              </Button>
            </Link>
            <Link href="/setup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="text-2xl">{mobileMenuOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-black text-white z-40 md:hidden border-b-2 border-gray-700">
          <div className="flex flex-col p-4 gap-4">
            <Link href="#features" className="text-sm uppercase tracking-wider py-2" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link href="#methodology" className="text-sm uppercase tracking-wider py-2" onClick={() => setMobileMenuOpen(false)}>
              Methodology
            </Link>
            <Link href="#pricing" className="text-sm uppercase tracking-wider py-2" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full text-white border-white">
                  Log In
                </Button>
              </Link>
              <Link href="/setup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="order-2 lg:order-1">
            <div className="inline-block bg-industrial-yellow px-3 py-1 md:px-4 md:py-2 mb-4 md:mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">
                Oil Trading Intelligence
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-none mb-4 md:mb-6">
              What Should You Do With Your Oil
              <span className="text-industrial-yellow"> TODAY</span>?
            </h1>

            <p className="text-base md:text-xl text-concrete-gray mb-6 md:mb-8 leading-relaxed">
              Real-time trading intelligence for oil & gas producers.
              Black-Scholes priced hedging strategies, location-aware basin pricing,
              and actionable opportunities delivered instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <Link href="/setup" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#methodology" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                  See The Math
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <p className="text-sm md:text-base text-concrete-gray italic">
                &quot;Strata gives us the visibility we need to make confident hedging decisions.&quot;
              </p>
              <p className="text-xs font-bold uppercase tracking-wider mt-2">
                — Independent Permian Producer
              </p>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-full h-full bg-industrial-yellow" />
            <div className="relative border-2 md:border-4 border-black bg-white p-1 md:p-2 shadow-2xl">
              <Image
                src="/dashboard-preview.png"
                alt="Strata Dashboard Preview"
                width={800}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-black text-white px-2 py-1 md:px-4 md:py-2">
              <span className="text-[10px] md:text-xs uppercase tracking-wider">Live Dashboard View</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 px-4 md:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-3 md:mb-4">
              Enterprise-Grade Trading Intelligence
            </h2>
            <p className="text-concrete-gray text-sm md:text-lg max-w-2xl mx-auto">
              Built for producers who want to maximize value from every barrel
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Feature 1 */}
            <div className="border-2 border-white p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-industrial-yellow flex items-center justify-center mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold">$</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">
                Real-Time Pricing
              </h3>
              <p className="text-concrete-gray text-sm md:text-base">
                Live WTI, Brent, and regional differentials. Quality-adjusted
                pricing based on your crude&apos;s API gravity and sulfur content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-white p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-industrial-yellow flex items-center justify-center mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold">Δ</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">
                Derivatives Pricing
              </h3>
              <p className="text-concrete-gray text-sm md:text-base">
                Black-Scholes priced puts and collars. Calculate Greeks (delta, gamma,
                theta, vega) for transparent hedging decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-white p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-industrial-yellow flex items-center justify-center mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold">◎</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">
                Basin Intelligence
              </h3>
              <p className="text-concrete-gray text-sm md:text-base">
                Location-aware pricing for Permian, Eagle Ford, Bakken, and more.
                Compare selling locally vs. Gulf Coast vs. export.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-2 border-white p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-industrial-yellow flex items-center justify-center mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold">▲</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">
                Actionable Opportunities
              </h3>
              <p className="text-concrete-gray text-sm md:text-base">
                Daily opportunities ranked by profit potential. Contango plays,
                basis trades, and export arbitrage with step-by-step execution.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="border-2 border-white p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-industrial-yellow flex items-center justify-center mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold">■</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">
                Hedging Strategies
              </h3>
              <p className="text-concrete-gray text-sm md:text-base">
                Protective puts, costless collars, and put spreads.
                Recommendations based on your risk tolerance and market conditions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="border-2 border-white p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-industrial-yellow flex items-center justify-center mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl font-bold">~</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">
                Futures Curve Analysis
              </h3>
              <p className="text-concrete-gray text-sm md:text-base">
                Track contango/backwardation in real-time. Identify storage arbitrage
                opportunities with live futures data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-3 md:mb-4">
              Transparent Methodology
            </h2>
            <p className="text-concrete-gray text-sm md:text-lg max-w-2xl mx-auto">
              We don&apos;t use black boxes. Here is the math behind our intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logic 1: Crude Valuation */}
            <div className="bg-white border-2 border-black p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono text-sm border border-black">1</span>
                Quality Banks
              </h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                We calculate your realized price by adjusting the benchmark WTI/Brent price against standard quality banks.
              </p>

              <div className="bg-black p-4 border border-black mb-4 text-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-x-auto">
                <p className="mb-2 text-gray-500 font-bold font-mono text-xs md:text-sm">// Price Adjustment Model</p>
                <div className="text-sm md:text-base">
                  <BlockMath math="\text{Price} = P_{benchmark} + \Delta_{API} + \Delta_{Sulfur}" />
                </div>
                <div className="h-px bg-gray-800 my-3"></div>
                <div className="text-xs md:text-sm">
                  <BlockMath math="\Delta_{API} = (\text{API}_{local} - 30^\circ) \times \$0.05" />
                  <BlockMath math="\Delta_{Sulfur} = (0.5\% - S_{local}) \times \$0.10" />
                </div>
              </div>

              <div className="bg-black p-4 border border-black mb-4 text-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-x-auto">
                <p className="mb-2 text-gray-500 font-bold font-mono text-xs md:text-sm">// Black-Scholes (Put Option)</p>
                <div className="text-sm md:text-base">
                  <BlockMath math="P = Ke^{-rT}N(-d_2) - S_0N(-d_1)" />
                </div>
                <div className="h-px bg-gray-800 my-3"></div>
                <div className="grid grid-cols-2 gap-x-2 text-xs opacity-80 font-mono">
                  <span>S₀ = Spot Price</span>
                  <span>K = Strike Price</span>
                  <span>σ = Volatility</span>
                  <span>T = Time to Expiry</span>
                </div>
              </div>

              <p className="text-[10px] text-concrete-gray uppercase tracking-wider">
                Real-time IV pulled from futures chains
              </p>
            </div>

            {/* Logic 3: Arbitrage */}
            <div className="bg-white border-2 border-black p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono text-sm border border-black">3</span>
                Arbitrage Detection
              </h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                Opportunities are ranked by Netback Analysis, comparing local sales vs. transport to other hubs.
              </p>

              <div className="bg-black p-4 border border-black mb-4 text-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-x-auto">
                <p className="mb-2 text-gray-500 font-bold font-mono text-xs md:text-sm">// Netback Comparison Algorithm</p>
                <div className="text-sm md:text-base">
                  <BlockMath math="\text{Netback} = P_{hub} - C_{transport} - C_{tariffs}" />
                </div>
                <div className="h-px bg-gray-800 my-3"></div>
                <p className="text-industrial-yellow font-bold font-mono text-xs md:text-sm">
                  if (Gulf_Netback &gt; Local_Netback)<br />
                  return &quot;Export Opportunity&quot;
                </p>
              </div>

              <p className="text-[10px] text-concrete-gray uppercase tracking-wider">
                Includes tariffs & terminal fees
              </p>
            </div>
          </div>

          {/* Beginner Guide Toggle */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowBeginnerGuide(!showBeginnerGuide)}
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:bg-black hover:text-white transition-colors px-4 py-2 border-2 border-black border-dashed"
            >
              <span>{showBeginnerGuide ? "Hide Explanation" : "New to all this?"}</span>
              <span className={`transition-transform duration-200 ${showBeginnerGuide ? "rotate-180" : ""}`}>▼</span>
            </button>
            <p className="text-xs text-concrete-gray mt-2 cursor-pointer hover:underline" onClick={() => setShowBeginnerGuide(!showBeginnerGuide)}>
              Click for a simple plain-English explanation
            </p>
          </div>

          {/* Collapsible Beginner Guide */}
          {showBeginnerGuide && (
            <div className="mt-8 border-t-2 border-black bg-white animation-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-2 border-t-0 border-black">
                {/* Analogy 1 */}
                <div className="p-6 md:p-8 bg-gray-50">
                  <h4 className="font-bold uppercase tracking-tight mb-3 text-lg">The Coffee Shop Analogy</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Concept: Quality Banks</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Imagine selling coffee beans. High-quality Arabica beans sell for more than generic Robusta.
                    <strong> Quality Banks</strong> are just the price list that says &quot;If your beans are 5% better, we pay $0.50 more.&quot;
                    We verify your oil&apos;s quality so you get paid for the premium stuff.
                  </p>
                </div>

                {/* Analogy 2 */}
                <div className="p-6 md:p-8 bg-gray-50">
                  <h4 className="font-bold uppercase tracking-tight mb-3 text-lg">The Car Insurance Analogy</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Concept: Option Pricing</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Hedging is just like buying insurance for your car. You pay a small monthly premium (the option price)
                    so that if you crash (oil prices drop to zero), the insurance company pays you the full value of your car.
                    We calculate exactly how much that &quot;premium&quot; should cost.
                  </p>
                </div>

                {/* Analogy 3 */}
                <div className="p-6 md:p-8 bg-gray-50">
                  <h4 className="font-bold uppercase tracking-tight mb-3 text-lg">The &quot;Selling Online&quot; Analogy</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Concept: Arbitrage</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Imagine you&apos;re selling a bike. In your town, it&apos;s worth $100. In the big city next door, it&apos;s worth $150.
                    But it costs $20 in gas to drive there.
                    <strong> Arbitrage</strong> is just the math: $150 - $20 (Gas) = $130.
                    Since $130 &gt; $100, you drive to the city. We do this for your oil every day.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-black text-white text-center border-l-2 border-r-2 border-b-2 border-black">
                <p className="text-sm font-mono">Ready to use the pro tools?</p>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/setup" className="inline-block">
              <Button variant="primary" size="lg" className="border-2 border-black">
                Explore The Models
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-industrial-yellow">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4 md:mb-6">
            Stop Leaving Money on the Table
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8">
            Join producers who are maximizing value from every barrel
            through intelligent trading decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link href="/setup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full text-base md:text-lg px-6 md:px-10 py-3 md:py-4 bg-black text-white hover:bg-gray-900">
                Create Free Account
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full text-base md:text-lg px-6 md:px-10 py-3 md:py-4">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 md:pb-8 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white flex items-center justify-center">
                <span className="text-black font-mono font-bold text-lg md:text-xl">S</span>
              </div>
              <span className="font-mono font-bold text-lg md:text-xl tracking-tighter">STRATA</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <Link href="#features" className="text-sm text-concrete-gray hover:text-white">Features</Link>
              <Link href="#pricing" className="text-sm text-concrete-gray hover:text-white">Pricing</Link>
              <Link href="#" className="text-sm text-concrete-gray hover:text-white">Documentation</Link>
              <Link href="#" className="text-sm text-concrete-gray hover:text-white">Contact</Link>
            </div>
          </div>

          <div className="pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
            <p className="text-xs md:text-sm text-concrete-gray">
              © 2026 Strata Trading Intelligence. All rights reserved.
            </p>
            <p className="text-xs md:text-sm text-concrete-gray">
              Built for oil producers. By oil traders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
