import type { SurnameRecord } from "@/types/names";

const labels: Record<SurnameRecord["originIllustrationKey"], string> = {
  "mountain-base": "A settlement at the base of a mountain",
  "rice-field": "Cultivated rice fields",
  "river-mouth": "A river meeting a wider body of water",
  bridge: "A bridge across a river",
  forest: "A grove or forest landscape",
  "village-center": "The center of a village",
  "island-coast": "An island coast",
  shrine: "A shrine landscape",
  castle: "A historic castle landscape",
  clan: "An abstract clan and lineage motif",
  occupation: "Traditional tools representing an occupation",
  uncertain: "An intentionally unresolved landscape",
};

export function OriginIllustration({
  illustrationKey,
}: {
  illustrationKey: SurnameRecord["originIllustrationKey"];
}) {
  const mountain = illustrationKey === "mountain-base";
  const field = illustrationKey === "rice-field";
  const river = illustrationKey === "river-mouth" || illustrationKey === "bridge";
  const forest = illustrationKey === "forest";
  const village = illustrationKey === "village-center";
  const island = illustrationKey === "island-coast";
  const built = ["shrine", "castle", "clan", "occupation"].includes(illustrationKey);

  return (
    <figure className="surface overflow-hidden">
      <svg
        aria-labelledby={`origin-${illustrationKey}`}
        className="h-auto w-full"
        role="img"
        viewBox="0 0 640 360"
      >
        <title id={`origin-${illustrationKey}`}>{labels[illustrationKey]}</title>
        <rect fill="#eef0e9" height="360" width="640" />
        <circle cx="500" cy="72" fill="#d9b67a" opacity=".72" r="34" />
        {(mountain || island || illustrationKey === "uncertain") && (
          <>
            <path d="M0 235 170 70l156 165Z" fill="#8da092" />
            <path d="m104 134 66-64 54 79-48-20-30 24Z" fill="#f1f0ea" opacity=".9" />
            <path d="m190 235 118-112 146 112Z" fill="#6e8577" />
          </>
        )}
        {(field || village) && (
          <>
            {[0, 1, 2, 3].map((row) => (
              <path
                d={`M${60 + row * 18} ${235 + row * 24}h500`}
                key={row}
                stroke="#96a676"
                strokeWidth="12"
              />
            ))}
            {[0, 1, 2, 3, 4, 5].map((column) => (
              <path d={`M${90 + column * 90} 218v112`} key={column} stroke="#d9d5b8" strokeWidth="3" />
            ))}
          </>
        )}
        {(river || island) && (
          <path
            d="M-20 265c130-70 220 60 337 2s214-24 350 18v95H-20Z"
            fill="#9eb9b6"
          />
        )}
        {illustrationKey === "bridge" && (
          <>
            <path d="M180 265c55-80 225-80 280 0" fill="none" stroke="#795d4d" strokeWidth="18" />
            <path d="M210 239v72M430 239v72" stroke="#795d4d" strokeWidth="10" />
          </>
        )}
        {forest && (
          <>
            {[90, 175, 270, 370, 465, 550].map((x, index) => (
              <g key={x}>
                <rect fill="#705b46" height="105" width="13" x={x} y={190 + (index % 2) * 10} />
                <circle cx={x + 7} cy={165 + (index % 2) * 8} fill={index % 2 ? "#55705f" : "#6d8270"} r="52" />
              </g>
            ))}
          </>
        )}
        {village && (
          <g>
            <path d="m240 238 80-62 80 62v82H240Z" fill="#dbd1c2" />
            <path d="m222 242 98-78 98 78" fill="none" stroke="#6e5548" strokeWidth="14" />
            <rect fill="#765a49" height="50" width="40" x="300" y="270" />
          </g>
        )}
        {built && (
          <g transform="translate(220 125)">
            {illustrationKey === "clan" ? (
              <>
                <circle cx="100" cy="90" fill="none" r="74" stroke="#a34837" strokeWidth="8" />
                <path d="M100 32v116M42 90h116M58 48l84 84M142 48l-84 84" stroke="#a34837" strokeWidth="5" />
              </>
            ) : illustrationKey === "occupation" ? (
              <>
                <path d="m40 150 120-120M72 18l72 144" stroke="#705b46" strokeLinecap="round" strokeWidth="18" />
                <circle cx="100" cy="90" fill="#d8c9ac" r="34" />
              </>
            ) : (
              <>
                <path d="M18 150h164M42 130h116l-18-45H60ZM70 78h60L116 34H84Z" fill="#d4cec2" stroke="#684f43" strokeLinejoin="round" strokeWidth="9" />
                {illustrationKey === "shrine" && <path d="M28 55h144M48 55v100M152 55v100M20 40h160" stroke="#a34837" strokeWidth="12" />}
              </>
            )}
          </g>
        )}
        {illustrationKey === "uncertain" && (
          <path d="M485 145c52 0 80 27 80 65s-36 52-56 70" fill="none" stroke="#65736a" strokeDasharray="8 10" strokeLinecap="round" strokeWidth="8" />
        )}
        <path d="M0 318c158-24 246 14 367-3s176-10 273 3v42H0Z" fill="#d8ded3" />
      </svg>
      <figcaption className="border-t border-[#deddd5] px-5 py-3 text-xs text-[#647068]">
        Reusable origin illustration: {labels[illustrationKey]}. This is a
        conceptual aid, not evidence of a specific ancestral location.
      </figcaption>
    </figure>
  );
}
