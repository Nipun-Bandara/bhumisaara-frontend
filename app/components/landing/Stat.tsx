"use client"

import { useId } from "react";

import CountUp from "./CountUp";

export function Stat() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-gutter pb-stack-lg pt-16 md:pt-8 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      {stats.map((feature, idx) => (
        <div
          key={idx}
          className="relative flex flex-col border border-outline-variant items-center justify-center bg-surface p-3 sm:p-6 rounded-3xl overflow-hidden soft-bloom"
        >
          <Grid size={20} />
          <div className="relative z-20 mb-4 text-primary">
            {feature.icon}
          </div>
          <div className="font-display-lg text-display-lg md:text-headline-lg lg:text-display-lg font-bold text-on-surface relative z-20 flex items-center">
            <CountUp
              from={0}
              to={feature.value}
              separator=","
              direction="up"
              duration={1.5}
              className="count-up-text"
            />
            {feature.suffix}
          </div>
          <p className="text-on-surface-variant mt-2 font-body-md text-body-md relative z-20 text-center">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}

const stats = [
  {
    title: "9K+",
    value: 900,
    suffix: "+",
    description: "Farmers Registered",
    icon: <span className="material-symbols-outlined text-4xl" data-icon="group">group</span>,
  },
  {
    title: "850+",
    value: 850,
    suffix: "+",
    description: "Verified Agro-Dealers",
    icon: <span className="material-symbols-outlined text-4xl" data-icon="storefront">storefront</span>,
  },
  {
    title: "5k+",
    value: 500,
    suffix: "T",
    description: "Metric Tons Distributed",
    icon: <span className="material-symbols-outlined text-4xl" data-icon="local_shipping">local_shipping</span>,
  },
  {
    title: "100%",
    value: 100,
    suffix: "%",
    description: "Blockchain Verified",
    icon: <span className="material-symbols-outlined text-4xl" data-icon="verified_user">verified_user</span>,
  },
];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  // Use a fixed pattern by default to avoid SSR hydration mismatches
  const p = pattern ?? [
    [7, 1],
    [8, 4],
    [9, 2],
    [10, 5],
    [8, 6],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<"svg"> & {
  width?: number;
  height?: number;
  x?: string | number;
  y?: string | number;
  squares?: number[][];
}) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: number[], idx: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${idx}`}
              width={Number(width) + 1}
              height={Number(height) + 1}
              x={x * Number(width)}
              y={y * Number(height)}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
