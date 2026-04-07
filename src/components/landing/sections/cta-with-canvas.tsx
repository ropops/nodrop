"use client";

import { GL } from "../../gl";
import { Section } from "../section";
import { Logo } from "../logo";
import Link from "next/link";
import { useState, useRef } from "react";
import { X } from "lucide-react";

// Custom easing function - ease out cubic for quick but smooth scroll
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function smoothScrollTo(targetY: number, duration: number = 600) {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    window.scrollTo(0, startY + difference * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const targetId = href.replace("#", "");
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    const headerOffset = 100;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    smoothScrollTo(targetPosition, 500);
  }
}

function handleScrollToTop(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  smoothScrollTo(0, 500);
}

type FormState = "idle" | "open" | "submitting" | "submitted";

export function CTAWithCanvas() {
  const [hovering, setHovering] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpenForm = () => {
    if (formState === "idle") {
      setFormState("open");

      // Scroll to center the form after it expands
      setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const containerHeight = rect.height;
          const windowHeight = window.innerHeight;
          const targetY = window.scrollY + rect.top - (windowHeight / 2) + (containerHeight / 2);
          smoothScrollTo(targetY, 500);
        }
      }, 100);
    }
  };

  const handleCloseForm = () => {
    if (formState === "open") {
      setFormState("idle");
      setFormData({ name: "", role: "", email: "", phone: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.email || !formData.phone) {
      return;
    }

    setFormState("submitting");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFormState("submitted");
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.role && formData.email && formData.phone;
  const isExpanded = formState === "open" || formState === "submitting";
  const isButtonDisabled = formState === "submitted";

  // Consistent polygon clip path for the angled corners
  const clipPath = "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";

  return (
    <div className="relative overflow-hidden min-h-[600px]">
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <GL hovering={hovering} />
      </div>

      {/* Dark overlay - 50% opacity */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Content */}
      <div className="relative z-20">
        {/* CTA Section */}
        <Section id="cta" className="py-32 md:py-40">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-sentient text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance">
                Ship faster. Learn faster.{" "}
                <em className="italic">Improve</em> continuously.
              </h2>

              <p className="font-mono text-base md:text-lg text-foreground/60 mt-8 max-w-xl mx-auto text-balance">
                Stop waiting for release cycles to improve your product. Start iterating in real time.
              </p>

              <div className="flex flex-col items-center justify-center mt-12">
                {/* Morphing Container */}
                <div
                  ref={containerRef}
                  onClick={formState === "idle" ? handleOpenForm : undefined}
                  onMouseEnter={() => formState === "idle" && setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  className={`
                    relative overflow-hidden
                    border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isExpanded
                      ? "w-full max-w-md p-6 border-primary bg-background/95 backdrop-blur-sm"
                      : isButtonDisabled
                        ? "px-8 py-4 border-foreground/20 bg-foreground/10 cursor-default"
                        : "px-8 py-4 border-primary bg-primary/90 cursor-pointer hover:bg-primary hover:shadow-[0_0_30px_rgba(181,155,80,0.3)]"
                    }
                  `}
                  style={{ clipPath }}
                >
                  {/* Button Content - shows when collapsed */}
                  <div
                    className={`
                      transition-all duration-300 ease-out
                      ${isExpanded ? "opacity-0 scale-95 h-0 overflow-hidden" : "opacity-100 scale-100"}
                    `}
                  >
                    <span className={`
                      font-mono text-sm uppercase tracking-wider whitespace-nowrap
                      ${isButtonDisabled ? "text-foreground/40" : "text-background"}
                    `}>
                      {isButtonDisabled ? "Request sent" : "Get started with Aperture"}
                    </span>
                  </div>

                  {/* Form Content - shows when expanded */}
                  <form
                    onSubmit={handleSubmit}
                    className={`
                      transition-all duration-500 ease-out
                      ${isExpanded
                        ? "opacity-100 max-h-[600px]"
                        : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                      }
                    `}
                  >
                    {/* Close Button */}
                    {formState === "open" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseForm();
                        }}
                        className="absolute top-3 right-3 p-1.5 text-foreground/40 hover:text-foreground/80 transition-colors duration-150 z-10"
                        aria-label="Close form"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    <div className={`
                      space-y-4 transition-all duration-300 delay-150
                      ${isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                    `}>
                      {/* Name */}
                      <div className="text-left">
                        <label className="block font-mono text-xs text-foreground/60 mb-2 uppercase tracking-wider">
                          Your name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={formState === "submitting"}
                          className="w-full bg-foreground/5 border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          style={{ clipPath }}
                          placeholder="John Doe"
                        />
                      </div>

                      {/* Role */}
                      <div className="text-left">
                        <label className="block font-mono text-xs text-foreground/60 mb-2 uppercase tracking-wider">
                          Role *
                        </label>
                        <select
                          required
                          value={formData.role}
                          onChange={(e) => handleInputChange("role", e.target.value)}
                          disabled={formState === "submitting"}
                          className="w-full bg-foreground/5 border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50 appearance-none cursor-pointer"
                          style={{ clipPath }}
                        >
                          <option value="" className="bg-background">Select your role</option>
                          <option value="executive" className="bg-background">Executive</option>
                          <option value="director" className="bg-background">Director</option>
                          <option value="product" className="bg-background">Product</option>
                          <option value="design" className="bg-background">Design</option>
                          <option value="engineering" className="bg-background">Engineering</option>
                        </select>
                      </div>

                      {/* Email */}
                      <div className="text-left">
                        <label className="block font-mono text-xs text-foreground/60 mb-2 uppercase tracking-wider">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={formState === "submitting"}
                          className="w-full bg-foreground/5 border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          style={{ clipPath }}
                          placeholder="john@company.com"
                        />
                      </div>

                      {/* Phone */}
                      <div className="text-left">
                        <label className="block font-mono text-xs text-foreground/60 mb-2 uppercase tracking-wider">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={formState === "submitting"}
                          className="w-full bg-foreground/5 border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          style={{ clipPath }}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={formState === "submitting" || !isFormValid}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                        className={`
                          w-full mt-2 px-8 py-4 font-mono text-sm uppercase tracking-wider
                          border transition-all duration-300
                          ${formState === "submitting"
                            ? "bg-foreground/10 border-foreground/30 text-foreground/50 cursor-wait"
                            : isFormValid
                              ? "bg-primary/90 border-primary text-background hover:bg-primary hover:shadow-[0_0_30px_rgba(181,155,80,0.3)]"
                              : "bg-foreground/5 border-foreground/20 text-foreground/30 cursor-not-allowed"
                          }
                        `}
                        style={{ clipPath }}
                      >
                        {formState === "submitting" ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Subtitle with transition */}
              <div className="relative h-8 mt-8">
                <p
                  className={`
                    absolute inset-x-0 font-mono text-xs text-foreground/40
                    transition-all duration-500 ease-out
                    ${formState === "submitted" ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}
                  `}
                >
                  Schedule a demo, plan a POC or pilot a product feature.
                </p>
                <p
                  className={`
                    absolute inset-x-0 font-mono text-xs text-foreground/40
                    transition-all duration-500 ease-out delay-100
                    ${formState === "submitted" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                  `}
                >
                  {"We'll soon be in touch!"}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="border-t border-border/20 py-12 md:py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <a href="/" onClick={handleScrollToTop} className="cursor-pointer inline-block">
                  <Logo className="w-[120px] text-foreground/60 mb-4" />
                </a>
                <p className="font-mono text-sm text-foreground/40">
                  Runtime layer for mobile UI iteration
                </p>
              </div>

              <nav className="flex flex-wrap gap-x-8 gap-y-4">
                {["How it works", "Capabilities", "Use cases"].map((item) => {
                  const href = `#${item.toLowerCase().replace(/\s+/g, "-")}`;
                  return (
                    <a
                      key={item}
                      href={href}
                      onClick={(e) => handleSmoothScroll(e, href)}
                      className="font-mono text-sm text-foreground/40 hover:text-foreground/80 transition-colors duration-150 cursor-pointer"
                    >
                      {item}
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-border/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-mono text-xs text-foreground/30">
                &copy; {new Date().getFullYear()} Aperture. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="#"
                  className="font-mono text-xs text-foreground/30 hover:text-foreground/60 transition-colors duration-150"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="font-mono text-xs text-foreground/30 hover:text-foreground/60 transition-colors duration-150"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
