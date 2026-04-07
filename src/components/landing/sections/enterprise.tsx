"use client";

import { Section, SectionHeader } from "../section";
import { ShieldCheck, FileCheck, GitBranch, ClipboardList } from "lucide-react";

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Approval workflows",
    description: "Every change requires approval before going live",
  },
  {
    icon: FileCheck,
    title: "Immutable artifacts",
    description: "Full version history with audit trails",
  },
  {
    icon: GitBranch,
    title: "State transitions",
    description: "Draft \u2192 Review \u2192 Approved \u2192 Live",
  },
  {
    icon: ClipboardList,
    title: "Auditability",
    description: "Complete traceability across all releases",
  },
];

export function EnterpriseSection() {
  return (
    <Section className="border-t border-border/30">
      <SectionHeader
        pill="Enterprise"
        title="Designed for controlled environments"
        description="Aperture is built for teams that require reliability and governance\u2014especially in regulated industries like banking and finance."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustFeatures.map((feature) => (
          <div key={feature.title} className="p-6 border border-border/50 bg-foreground/5">
            <feature.icon className="size-6 text-primary mb-4" />
            <h3 className="font-mono text-sm uppercase tracking-wide mb-2">
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
