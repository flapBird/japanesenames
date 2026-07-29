import type { SVGProps } from "react";

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 64 64"
      {...props}
    >
      <rect fill="#F7F5EF" height="62" rx="15" width="62" x="1" y="1" />
      <circle cx="32" cy="31" fill="#315C4B" r="19.75" />
      <path
        d="M18.9 22c5.25-2 9.625-1 13.1 2.375V42.1c-3.625-3.125-8-4.125-13.1-2.25V22Z"
        fill="#F7F5EF"
      />
      <path
        d="M45.1 22c-5.25-2-9.625-1-13.1 2.375V42.1c3.625-3.125 8-4.125 13.1-2.25V22Z"
        fill="#F7F5EF"
      />
      <path d="M32 24.4v17.7" stroke="#A34837" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
