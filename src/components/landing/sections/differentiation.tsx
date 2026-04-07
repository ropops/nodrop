"use client";

import { Section, SectionHeader } from "../section";
import { X, Check } from "lucide-react";

const comparison = {
  traditional: [
    "Depend on developers for every change",
    "Operate at feature flag or analytics level",
    "Lack control over UI structure",
    "Web-first, adapted for mobile",
    "Fragmented across multiple tools",
  ],
  aperture: [
    "Controls the UI at runtime",
    "Integrates with your design system",
    "Enables instant iteration without releases",
    "Built mobile-first from the ground up",
    "Unified platform: config, experiments, delivery",
  ],
};

export function DifferentiationSection() {
  return (
    <Section className="border-t border-border/30">
      <SectionHeader
        pill="Why Aperture"
        title="Built for mobile. Not adapted from web."
      />

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Traditional tools */}
        <div className="p-6 md:p-8 border border-border/50 bg-foreground/5">
          <h3 className="font-mono text-sm uppercase tracking-wide text-foreground/40 mb-6">
            Traditional tools
          </h3>
          <ul className="space-y-4">
            {comparison.traditional.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <X className="size-4 text-foreground/30 shrink-0 mt-0.5" />
                <span className="font-mono text-sm text-foreground/60">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aperture */}
        <div className="p-6 md:p-8 border border-primary/50 bg-primary/5">
          <h3 className="font-mono text-sm uppercase tracking-wide text-primary mb-6">
            Aperture
          </h3>
          <ul className="space-y-4">
            {comparison.aperture.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="size-4 text-primary shrink-0 mt-0.5" />
                <span className="font-mono text-sm text-foreground/80">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
