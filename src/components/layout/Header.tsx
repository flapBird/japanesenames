import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const navigation = [
  { href: "/#generator", label: "Generator" },
  { href: "/japanese-girl-names", label: "Girl Names" },
  { href: "/japanese-boy-names", label: "Boy Names" },
  { href: "/japanese-last-names", label: "Last Names" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-[#deddd5] bg-[#f7f5ef]/95">
      <div className="container-page flex min-h-18 items-center justify-between gap-5">
        <Link
          className="flex items-center gap-3 font-semibold tracking-[-0.02em]"
          href="/"
        >
          <BrandMark className="size-8" />
          <span>Japanese Names</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              className="text-sm font-medium text-[#536058] hover:text-[#244638]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button-secondary !min-h-9 !px-3" href="/favorites">
            Favorites
          </Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="button-secondary !min-h-10" aria-label="Open navigation">
            Menu
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-12 z-30 grid min-w-52 gap-1 rounded-xl border border-[#deddd5] bg-[#fffefb] p-2 shadow-xl"
          >
            {navigation.map((item) => (
              <Link className="rounded-lg px-3 py-2 text-sm hover:bg-[#e7eee9]" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="rounded-lg px-3 py-2 text-sm hover:bg-[#e7eee9]" href="/favorites">
              Favorites
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
