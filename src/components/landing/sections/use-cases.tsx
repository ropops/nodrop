"use client";

import { Section, SectionHeader } from "../section";
import { ArrowRight } from "lucide-react";

const useCases = [
  {
    title: "Optimize onboarding flows",
    description: "Test messaging, layout, and sequencing without waiting for releases. Find what converts best, faster.",
  },
  {
    title: "Improve conversion funnels",
    description: "Iterate on key steps\u2014pricing, upsell, insurance, lending\u2014in real time. No more quarterly experiments.",
  },
  {
    title: "Run experiments continuously",
    description: "Move from occasional tests to constant optimization. Every hypothesis can be tested immediately.",
  },
  {
    title: "Personalize user experiences",
    description: "Deliver different UI variants to different segments. Tailor experiences without hardcoding logic.",
  },
];

export function UseCasesSection() {
  return (
    <Section id="use-cases" className="border-t border-border/30">
      <SectionHeader
        pill="Use cases"
        title="Where Aperture creates immediate impact"
      />

      <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
        {useCases.map((useCase) => (
          <div
            key={useCase.title}
            className="group p-6 md:p-8 border border-border/50 bg-foreground/5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-sentient text-xl md:text-2xl mb-4">
                {useCase.title}
              </h3>
              <ArrowRight className="size-5 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1" />
            </div>
            <p className="font-mono text-sm text-foreground/60 leading-relaxed">
              {useCase.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
