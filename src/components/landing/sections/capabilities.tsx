"use client";

import { Section, SectionHeader } from "../section";
import {
  Palette,
  MousePointerClick,
  FlaskConical,
  ShieldCheck,
  RotateCcw,
  Lock
} from "lucide-react";

const capabilities = [
  {
    icon: Palette,
    title: "Design system-native",
    description: "Work directly with your production components\u2014not approximations or web-based previews.",
  },
  {
    icon: MousePointerClick,
    title: "No-code iteration",
    description: "Update copy, layout, and structure without engineering involvement or code changes.",
  },
  {
    icon: FlaskConical,
    title: "Experimentation built-in",
    description: "Run A/B and multivariate tests using page sets and traffic splits. Analytics included.",
  },
  {
    icon: ShieldCheck,
    title: "Governed delivery",
    description: "Every change goes through approval states\u2014draft, review, approved, live.",
  },
  {
    icon: RotateCcw,
    title: "Versioning & rollback",
    description: "Full version history with instant rollback. Every release is tracked and reversible.",
  },
  {
    icon: Lock,
    title: "Safe by design",
    description: "Fallback to default screens, no runtime code injection, immutable artifacts.",
  },
];

export function CapabilitiesSection() {
  return (
    <Section id="capabilities" className="border-t border-border/30">
      <SectionHeader
        pill="Capabilities"
        title="Everything you need to iterate without releases"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
        {capabilities.map((capability) => (
          <div key={capability.title} className="group">
            <div className="flex items-start gap-4">
              <div className="size-10 flex items-center justify-center border border-border/50 bg-foreground/5 shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors duration-300">
                <capability.icon className="size-4 text-foreground/60 group-hover:text-primary transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-mono text-sm uppercase tracking-wide mb-2">
                  {capability.title}
                </h3>
                <p className="font-mono text-sm text-foreground/60 leading-relaxed">
                  {capability.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
