"use client";

import { Section, SectionHeader } from "../section";

const steps = [
  {
    number: "01",
    title: "Plug-in Aperture to an existing or a new mobile flow.",
    description: "Use your existing components. No duplication, no rebuild. Aperture integrates directly with your production component library.",
  },
  {
    number: "02",
    title: "Build and modify screens visually",
    description: "Compose pages, adjust content, and define variants using a controlled editor. Work with real components, not mockups.",
  },
  {
    number: "03",
    title: "Deploy instantly, with approval",
    description: "Push changes live through a built-in approval flow\u2014safe, versioned, reversible. No app store, no release cycle.",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="border-t border-border/30">
      <SectionHeader
        pill="How it works"
        title="Three steps to instant iteration"
      />

      <div className="grid md:grid-cols-3 gap-8 md:gap-0">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative md:pr-12 md:pl-12 first:md:pl-0 last:md:pr-0"
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-border/50 to-transparent" />
            )}

            <div className="relative">
              <span className="font-mono text-4xl md:text-5xl text-foreground/10 font-light">
                {step.number}
              </span>
              <h3 className="font-sentient text-xl md:text-2xl mt-4 mb-4">
                {step.title}
              </h3>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
