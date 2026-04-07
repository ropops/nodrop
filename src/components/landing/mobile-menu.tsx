"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface MobileMenuProps {
  className?: string;
}

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

export const MobileMenu = ({ className }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Capabilities", href: "#capabilities" },
    { name: "Use cases", href: "#use-cases" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    // Small delay to let menu close animation start
    setTimeout(() => {
      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 100;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
        smoothScrollTo(targetPosition, 500);
      }
    }, 100);
  };

  return (
    <Dialog.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "group lg:hidden p-2 text-foreground transition-colors",
            className
          )}
          aria-label="Open menu"
        >
          <Menu className="group-[[data-state=open]]:hidden" size={24} />
          <X className="hidden group-[[data-state=open]]:block" size={24} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <div
          data-overlay="true"
          className="fixed z-30 inset-0 bg-black/50 backdrop-blur-sm"
        />

        <Dialog.Content
          onInteractOutside={(e) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.dataset.overlay !== "true"
            ) {
              e.preventDefault();
            }
          }}
          className="fixed top-0 left-0 w-full z-40 py-28 md:py-40"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <nav className="flex flex-col space-y-6 container mx-auto">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="text-xl font-mono uppercase text-foreground/60 transition-colors ease-out duration-150 hover:text-foreground/100 py-2 cursor-pointer"
              >
                {item.name}
              </a>
            ))}

            <div className="mt-6">
              <a
                href="#cta"
                onClick={(e) => handleLinkClick(e, "#cta")}
                className="inline-block text-xl font-mono uppercase text-primary transition-colors ease-out duration-150 hover:text-primary/80 py-2 cursor-pointer"
              >
                Get Started
              </a>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
