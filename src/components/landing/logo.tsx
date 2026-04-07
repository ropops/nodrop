export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 140 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Aperture icon - camera aperture shape */}
      <g>
        <path
          d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M14 6l2.5 4.5L20 14l-3.5 3.5L14 22l-2.5-4.5L8 14l3.5-3.5L14 6z"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path
          d="M14 8L10 14l4 6M14 8l4 6-4 6M8 14h12"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="14" r="3" fill="currentColor" />
      </g>
      {/* Text: APERTURE */}
      <text
        x="32"
        y="18.5"
        fontFamily="monospace"
        fontSize="14"
        fontWeight="500"
        fill="currentColor"
        letterSpacing="0.05em"
      >
        APERTURE
      </text>
    </svg>
  );
};
