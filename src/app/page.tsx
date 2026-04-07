"use client";

import { Hero } from "@/components/landing/hero";
import { Header } from "@/components/landing/header";
import { ProblemSection } from "@/components/landing/sections/problem";
import { SolutionSection } from "@/components/landing/sections/solution";
import { HowItWorksSection } from "@/components/landing/sections/how-it-works";
import { CapabilitiesSection } from "@/components/landing/sections/capabilities";
import { ProductShowcaseSection } from "@/components/landing/sections/product-showcase";
import { UseCasesSection } from "@/components/landing/sections/use-cases";
import { DifferentiationSection } from "@/components/landing/sections/differentiation";
import { EnterpriseSection } from "@/components/landing/sections/enterprise";
import { CTAWithCanvas } from "@/components/landing/sections/cta-with-canvas";
import { Leva } from "leva";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main className="relative z-10 bg-background">
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <ProductShowcaseSection />
        <CapabilitiesSection />
        <UseCasesSection />
        <DifferentiationSection />
        <EnterpriseSection />
      </main>
      <CTAWithCanvas />
      <Leva hidden />
    </>
  );
}
