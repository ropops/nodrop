"use client";

import { Section, SectionHeader } from "../section";

const painPoints = [
  "Design",
  "Development",
  "QA",
  "Release",
  "App store delays",
  "Coordination overhead",
];

export function ProblemSection() {
  return (
    <Section id="problem" className="border-t border-border/30">
      <SectionHeader
        pill="The Problem"
        title="Mobile iteration is still bottlenecked by development"
      />

      <div className="grid md:grid-cols-2 gap-12 md:gap-20">
        <div>
          <p className="font-mono text-foreground/60 text-sm sm:text-base leading-relaxed mb-8">
            Every change to your mobile UI—copy, layout, structure—goes through the same exhausting cycle:
          </p>

          <div className="flex flex-wrap gap-3">
            {painPoints.map((point, index) => (
              <span
                key={point}
                className="font-mono text-sm px-4 py-2 border border-border/50 text-foreground/70 bg-foreground/5"
              >
                {index < 4 && <span className="text-foreground/30 mr-2">{index + 1}.</span>}
                {point}
              </span>
            ))}
          </div>

          <p className="font-mono text-foreground/60 text-sm sm:text-base leading-relaxed mt-8">
            That makes iteration slow, expensive, and infrequent.
          </p>
        </div>

        <div className="flex items-center">
          <div className="border-l-2 border-primary pl-6 py-4">
            <p className="text-xl sm:text-2xl font-sentient text-balance">
              You don&apos;t have an experimentation problem.
            </p>
            <p className="text-xl sm:text-2xl font-sentient mt-2">
              You have a <i className="font-light text-primary">deployment</i> problem.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
