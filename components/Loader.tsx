"use client";

import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

type LoaderProps = {
  size?: number;
  stroke?: number;
  speed?: number;
  color?: string;
  className?: string;
};

export function Loader({
  size = 40,
  stroke = 5,
  speed = 2,
  // The design token rather than a literal, so the ring tracks the theme
  // instead of staying the same neon green on both. `Ring` writes this
  // straight into a CSS custom property it then reads with `stroke:
  // var(...)`, so a `var()` reference resolves normally — pass
  // "currentColor" here to inherit the parent's text colour instead.
  color = "var(--primary)",
  className,
}: LoaderProps) {
  return (
    <div className={className}>
      <Ring
        size={String(size)}
        stroke={String(stroke)}
        bgOpacity="0"
        speed={String(speed)}
        color={color}
      />
    </div>
  );
}

export default Loader;