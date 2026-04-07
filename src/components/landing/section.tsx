import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section({ id, className, children }, ref) {
    return (
      <section
        ref={ref}
        id={id}
        className={cn("py-24 md:py-32 relative", className)}
      >
        <div className="container">
          {children}
        </div>
      </section>
    );
  }
);

export function SectionHeader({
  pill,
  title,
  description,
  className,
}: {
  pill?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-16 md:mb-20", className)}>
      {pill && (
        <span className="font-mono text-sm text-primary uppercase tracking-wider mb-4 block">
          {pill}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-sentient text-balance max-w-3xl">
        {title}
      </h2>
      {description && (
        <p className="font-mono text-foreground/60 mt-6 max-w-2xl text-sm sm:text-base text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
