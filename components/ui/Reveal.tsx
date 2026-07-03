"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  style?: CSSProperties;
}

export function Reveal({ children, delay = 0, className = "", direction = "up", style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Determine initial transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case "up": return "translate-y-16";
      case "down": return "-translate-y-16";
      case "left": return "translate-x-16";
      case "right": return "-translate-x-16";
      default: return "translate-y-16";
    }
  };

  const transformReset = direction === "up" || direction === "down" ? "translate-y-0" : "translate-x-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${className} ${
        isVisible ? `opacity-100 ${transformReset}` : `opacity-0 ${getInitialTransform()}`
      }`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
