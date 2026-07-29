import type { PrefectureDistribution } from "@/types/names";

const prefectures = [
  "Hokkaidō", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima",
  "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa",
  "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu",
  "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyōgo", "Nara",
  "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi",
  "Tokushima", "Kagawa", "Ehime", "Kōchi", "Fukuoka", "Saga", "Nagasaki",
  "Kumamoto", "Ōita", "Miyazaki", "Kagoshima", "Okinawa",
];

const positions = prefectures.map((name, index) => ({
  name,
  code: String(index + 1).padStart(2, "0"),
  x: index < 1 ? 520 : 500 - Math.floor((index - 1) / 8) * 70,
  y: index < 1 ? 20 : 62 + ((index - 1) % 8) * 34,
}));

export function JapanPrefectureMap({
  regions,
}: {
  regions: PrefectureDistribution[];
}) {
  if (regions.length === 0) {
    return (
      <div className="surface grid min-h-64 place-items-center p-8 text-center">
        <div>
          <span className="seal mx-auto mb-4" aria-hidden="true">未</span>
          <p className="font-semibold">
            Reliable regional distribution data is not yet available for this surname.
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647068]">
            We do not infer modern population distribution from the kanji, a
            general origin story, or an unverified historical claim.
          </p>
        </div>
      </div>
    );
  }

  const regionMap = new Map(regions.map((region) => [region.prefectureCode, region]));
  const topRegions = [...regions].sort((a, b) => b.relativePopularity - a.relativePopularity).slice(0, 5);
  return (
    <div className="surface grid gap-5 p-5 md:grid-cols-[1.4fr_1fr]">
      <svg aria-label="Stylized map of Japan’s 47 prefectures" className="h-auto w-full" role="img" viewBox="0 0 600 360">
        {positions.map((prefecture) => {
          const region = regionMap.get(prefecture.code);
          const opacity = region ? 0.35 + region.relativePopularity * 0.0065 : 0.1;
          return (
            <rect
              fill={region?.dataType === "historical_origin" ? "#a34837" : "#315c4b"}
              height="26"
              key={prefecture.code}
              opacity={opacity}
              rx="5"
              width="58"
              x={prefecture.x}
              y={prefecture.y}
            >
              <title>
                {prefecture.name}: {region ? `${region.relativePopularity}% relative signal (${region.dataType.replace("_", " ")})` : "no sourced data"}
              </title>
            </rect>
          );
        })}
      </svg>
      <div>
        <p className="eyebrow">Strongest sourced signals</p>
        <ol className="mt-4 grid gap-3">
          {topRegions.map((region) => (
            <li className="border-b border-[#e3e2dc] pb-3" key={`${region.prefectureCode}-${region.dataType}`}>
              <div className="flex justify-between gap-4 text-sm font-semibold">
                <span>{region.prefectureName}</span>
                <span>{region.relativePopularity}%</span>
              </div>
              <p className="mt-1 text-xs capitalize text-[#647068]">{region.dataType.replaceAll("_", " ")}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
