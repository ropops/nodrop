"use client";

import { Section, SectionHeader } from "../section";
import { Zap, Layers, FlaskConical } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Render screens dynamically",
    description: "From approved components in your design system",
  },
  {
    icon: Zap,
    title: "Modify without code",
    description: "Content and layout changes\u2014no engineering required",
  },
  {
    icon: FlaskConical,
    title: "Launch experiments instantly",
    description: "A/B and multivariate tests with built-in analytics",
  },
];

export function SolutionSection() {
  return (
    <Section className="border-t border-border/30">
      <SectionHeader
        pill="Solution: Aperture"
        title="Iteration and testing, without release cycles"
        description="Update UI, A/B test and improve conversion for your mobile app flows, in real time, using your design system, without shipping a new build."
      />

      <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
        {features.map((feature) => (
          <div key={feature.title} className="group">
            <div className="size-12 flex items-center justify-center border border-border/50 bg-foreground/5 mb-6 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors duration-300">
              <feature.icon className="size-5 text-foreground/60 group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="font-mono text-sm uppercase tracking-wide mb-3">
              {feature.title}
            </h3>
            <p className="font-mono text-sm text-foreground/60">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
