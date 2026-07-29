import type { NameOrder } from "@/types/names";

export function NameOrderToggle({
  value,
  onChange,
}: {
  value: NameOrder;
  onChange: (value: NameOrder) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Name order</legend>
      <div className="inline-flex rounded-full border border-[#cfd1ca] bg-[#eeeee8] p-1">
        {(["japanese", "western"] as const).map((order) => (
          <button
            aria-pressed={value === order}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              value === order
                ? "bg-[#fffefb] text-[#244638] shadow-sm"
                : "text-[#6b746e]"
            }`}
            key={order}
            onClick={() => onChange(order)}
            type="button"
          >
            {order === "japanese" ? "Japanese order" : "Western order"}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
