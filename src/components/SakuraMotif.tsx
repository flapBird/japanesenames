import type { SVGProps } from "react";

function Blossom({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((rotation) => (
        <ellipse
          cx="0"
          cy="-10"
          fill="#E4A5B0"
          key={rotation}
          rx="6"
          ry="11"
          transform={`rotate(${rotation})`}
        />
      ))}
      <circle fill="#A3485A" r="3.2" />
    </g>
  );
}

export function SakuraMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 240 150"
      {...props}
    >
      <path
        d="M232 20c-49 8-73 35-101 67-26 30-56 42-111 43"
        stroke="#9A665C"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M166 52c-1 21 8 35 28 47M113 104c-12-17-29-25-51-25"
        stroke="#9A665C"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <Blossom x={181} y={48} scale={1.05} />
      <Blossom x={196} y={101} scale={0.78} />
      <Blossom x={113} y={95} scale={0.9} />
      <Blossom x={57} y={79} scale={0.68} />
      <circle cx="149" cy="68" fill="#D78D9A" r="4" />
      <circle cx="83" cy="116" fill="#D78D9A" r="3.5" />
    </svg>
  );
}
