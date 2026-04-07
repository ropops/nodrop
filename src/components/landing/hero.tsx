"use client";

import { GL } from "../gl";
import { Pill } from "./pill";
import { LandingButton } from "./landing-button";
import { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

// First value is always 6 or 8, second value cycles through these
const FIRST_VALUES = [6, 8];
const SECOND_VALUES = [12, 20, 26, 35, 40, 45];
const CYCLE_DURATION = 4000; // 4 seconds per value
const TUMBLE_DURATION = 1800; // 1.8 seconds of tumbling
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Slot machine digit with tumbling random digits before landing
function SlotDigit({
  targetChar,
  delay = 0,
  animationKey = 0
}: {
  targetChar: string;
  delay?: number;
  animationKey?: number;
}) {
  const [tumbleChars, setTumbleChars] = useState<string[]>([targetChar]);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const lastKeyRef = useRef(animationKey);

  useEffect(() => {
    // Only animate when key changes (not on initial mount for key 0)
    if (animationKey === lastKeyRef.current) return;
    lastKeyRef.current = animationKey;

    // Start tumbling after delay
    const startTimeout = setTimeout(() => {
      // Generate random tumble sequence ending with target
      const numTumbles = 12 + Math.floor(Math.random() * 8);
      const chars: string[] = [];
      for (let i = 0; i < numTumbles; i++) {
        chars.push(DIGITS[Math.floor(Math.random() * DIGITS.length)]);
      }
      chars.push(targetChar); // End with target
      setTumbleChars(chars);
      setIsAnimating(true);
    }, delay);

    // Stop tumbling - keep the final value displayed
    const endTimeout = setTimeout(() => {
      setIsAnimating(false);
      setTumbleChars([targetChar]);
    }, delay + TUMBLE_DURATION + 100);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(endTimeout);
    };
  }, [animationKey, targetChar, delay]);

  const itemCount = tumbleChars.length;
  // Calculate how far to scroll: (itemCount - 1) items * 1.2em per item
  const scrollDistance = (itemCount - 1) * 1.2;

  return (
    <span
      ref={containerRef}
      className="inline-block relative overflow-hidden"
      style={{
        height: "1.2em",
        width: "0.65em",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
      }}
    >
      <span
        className="inline-flex flex-col"
        style={{
          transform: isAnimating ? `translateY(-${scrollDistance}em)` : 'translateY(0)',
          transition: isAnimating ? `transform ${TUMBLE_DURATION}ms cubic-bezier(0.23, 1, 0.32, 1)` : 'none'
        }}
      >
        {tumbleChars.map((char, i) => (
          <span key={i} className="inline-block h-[1.2em] leading-[1.2] text-center">{char}</span>
        ))}
      </span>
    </span>
  );
}

function AnimatedPercentage() {
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Initial animation after mount
    const initialTimeout = setTimeout(() => {
      setAnimationKey(1);
    }, 500);

    // Then cycle continuously
    const interval = setInterval(() => {
      setFirstIndex((prev) => (prev + 1) % FIRST_VALUES.length);
      setSecondIndex((prev) => (prev + 1) % SECOND_VALUES.length);
      setAnimationKey((prev) => prev + 1);
    }, CYCLE_DURATION);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const firstValue = FIRST_VALUES[firstIndex].toString();
  const secondValue = SECOND_VALUES[secondIndex].toString();

  // Split second value into individual digits
  const secondDigits = secondValue.padStart(2, "0").split("");

  return (
    <span className="inline-flex">
      <SlotDigit targetChar={firstValue} delay={0} animationKey={animationKey} />
      <span className="inline-block">-</span>
      <SlotDigit targetChar={secondDigits[0]} delay={80} animationKey={animationKey} />
      <SlotDigit targetChar={secondDigits[1]} delay={160} animationKey={animationKey} />
      <span className="inline-block">%</span>
    </span>
  );
}

export function Hero() {
  const [hovering, setHovering] = useState(false);

  const scrollToContent = () => {
    const problemSection = document.getElementById("problem");
    if (problemSection) {
      problemSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col h-svh justify-between overflow-hidden">
      <GL hovering={hovering} />

      <div className="pb-16 mt-auto text-center relative z-10">
        <Pill className="mb-6">TIME TO GAIN SPEED</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient text-balance">
          <AnimatedPercentage /> CVR increases <br />
          <i className="font-light">lost</i> every day
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[540px] mx-auto px-4">
          Every flow you build in mobile that you don&apos;t iterate on is leaving money on the table
        </p>

        <LandingButton
          className="mt-14 max-sm:hidden"
          onClick={scrollToContent}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <ArrowDown className="size-5" />
        </LandingButton>
        <LandingButton
          size="sm"
          className="mt-14 sm:hidden"
          onClick={scrollToContent}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <ArrowDown className="size-5" />
        </LandingButton>
      </div>
    </div>
  );
}
