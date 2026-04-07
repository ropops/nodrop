"use client";

import { Section, SectionHeader } from "../section";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const screenshots = [
  {
    id: "builder",
    title: "Visual Page Builder",
    description: "Compose screens from your design system components. Configure content, styling, and behavior\u2014all without code.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Builder-psVNPVvwhOqoGt78ubg7NVlqt3i1aJ.png",
  },
  {
    id: "releases",
    title: "Release Management",
    description: "Track production releases, experiments, and their performance. Full visibility into what\u2019s live and what\u2019s been tested.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Main-RNNpsZyOekyK0G86aVDMYjZyJxXh2A.png",
  },
  {
    id: "flows",
    title: "A/B Testing Flows",
    description: "Visualize experiment traffic splits and user journeys. See exactly how users flow through your variants.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Flows-d6qacYuCw1i3ROumMs6FlQAX1kAfXz.png",
  },
];

const TAB_DURATION = 6000;

export function ProductShowcaseSection() {
  const [viewMode, setViewMode] = useState<"screenshots" | "animated">("screenshots");
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedProgressRef = useRef<number>(0);

  useEffect(() => {
    if (viewMode !== "animated" || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (viewMode !== "animated") {
        setProgress(0);
      }
      return;
    }

    startTimeRef.current = Date.now() - (pausedProgressRef.current * TAB_DURATION);

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed % TAB_DURATION) / TAB_DURATION, 1);
      setProgress(newProgress);

      if (elapsed >= TAB_DURATION) {
        setActiveTab((prev) => (prev + 1) % screenshots.length);
        setProgress(0);
        startTimeRef.current = Date.now();
        pausedProgressRef.current = 0;
      }
    };

    intervalRef.current = setInterval(updateProgress, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [viewMode, activeTab, isPaused]);

  const handleTabClick = (index: number) => {
    if (viewMode === "animated") {
      if (index === activeTab) {
        if (!isPaused) {
          pausedProgressRef.current = progress;
        }
        setIsPaused(!isPaused);
      } else {
        setActiveTab(index);
        setProgress(0);
        pausedProgressRef.current = 0;
        setIsPaused(false);
      }
    } else {
      setActiveTab(index);
    }
  };

  const activeScreenshot = screenshots[activeTab];

  return (
    <Section id="product" className="border-t border-border/30 overflow-hidden">
      <SectionHeader
        pill="Product"
        title="See Aperture in action"
        description="A complete platform for building, testing, and deploying mobile UI changes\u2014without code."
      />

      {/* Segmented controller */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex border border-border/50 p-1 gap-1">
          <button
            onClick={() => setViewMode("screenshots")}
            className={`font-mono text-xs px-4 py-2 transition-all duration-200 ${
              viewMode === "screenshots"
                ? "bg-primary/20 text-primary"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            Screenshots
          </button>
          <button
            onClick={() => setViewMode("animated")}
            className={`font-mono text-xs px-4 py-2 transition-all duration-200 ${
              viewMode === "animated"
                ? "bg-primary/20 text-primary"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            Animated
          </button>
        </div>
      </div>

      {/* Tab navigation with progress indicators */}
      <div className="flex flex-wrap gap-2 mb-8">
        {screenshots.map((screenshot, index) => (
          <button
            key={screenshot.id}
            onClick={() => handleTabClick(index)}
            className={`relative font-mono text-sm px-4 py-2 border transition-all duration-300 overflow-hidden ${
              activeTab === index
                ? "border-primary text-primary bg-primary/10"
                : "border-border/50 text-foreground/60 hover:text-foreground hover:border-border"
            }`}
          >
            <span className="flex items-center gap-2">
              {screenshot.title}
              {viewMode === "animated" && activeTab === index && isPaused && (
                <span className="w-2 h-2 flex gap-0.5">
                  <span className="w-0.5 h-2 bg-primary" />
                  <span className="w-0.5 h-2 bg-primary" />
                </span>
              )}
            </span>
            {viewMode === "animated" && activeTab === index && (
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all ${isPaused ? "opacity-50" : "opacity-100"}`}
                style={{
                  width: `${progress * 100}%`,
                  transitionDuration: isPaused ? "0ms" : "100ms"
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content area */}
      {activeScreenshot && (
        <div className="relative">
          <div className="border border-border/50 bg-foreground/5 p-2 md:p-4">
            <Image
              src={activeScreenshot.image}
              alt={activeScreenshot.title}
              width={1400}
              height={900}
              className="w-full h-auto"
            />
          </div>
          <p className="font-mono text-sm text-foreground/60 mt-6 max-w-2xl">
            {activeScreenshot.description}
          </p>
        </div>
      )}
    </Section>
  );
}
