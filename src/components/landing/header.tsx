"use client";

import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

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
    const headerOffset = 100; // Account for fixed header
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    smoothScrollTo(targetPosition, 500); // 500ms duration - quick but smooth
  }
}

function handleScrollToTop(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  smoothScrollTo(0, 500);
}

export const Header = () => {
  return (
    <div className="fixed z-50 pt-8 md:pt-14 top-0 left-0 w-full">
      <header className="flex items-center justify-between container">
        <a href="/" onClick={handleScrollToTop} className="cursor-pointer">
          <Logo className="w-[140px] md:w-[160px] text-foreground" />
        </a>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-10">
          {["How it works", "Capabilities", "Use cases"].map((item) => {
            const href = `#${item.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <a
                className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out text-sm cursor-pointer"
                href={href}
                onClick={(e) => handleSmoothScroll(e, href)}
                key={item}
              >
                {item}
              </a>
            );
          })}
        </nav>
        <a
          className="uppercase max-lg:hidden transition-colors ease-out duration-150 font-mono text-primary hover:text-primary/80 text-sm cursor-pointer"
          href="#cta"
          onClick={(e) => handleSmoothScroll(e, "#cta")}
        >
          Get Started
        </a>
        <MobileMenu />
      </header>
    </div>
  );
};
