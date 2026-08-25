import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#deddd5] bg-[#f1f0ea]">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.5fr_0.9fr_0.9fr]">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-3 font-semibold">
            <BrandMark className="size-8" />
            Japanese Names
          </div>
          <p className="text-sm leading-6 text-[#647068]">
            A careful starting point for Japanese names, kanji meanings, and
            surname stories. Interpretations are labeled by evidence level.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold">Explore</h2>
          <div className="grid gap-2 text-sm text-[#647068]">
            <Link href="/#generator">Japanese Name Generator</Link>
            <Link href="/ai-japanese-name-generator">Describe a name with AI</Link>
            <Link href="/japanese-last-name-generator">Last name generator</Link>
            <Link href="/japanese-girl-names">Girl names</Link>
            <Link href="/japanese-boy-names">Boy names</Link>
            <Link href="/japanese-last-names">Japanese surnames</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold">Site</h2>
          <div className="grid gap-2 text-sm text-[#647068]">
            <Link href="/about">About our data</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#deddd5] py-5 text-center text-xs text-[#6f7872]">
        © {new Date().getFullYear()} Japanese Names. Meanings are guidance, not
        proof of personal ancestry.
      </div>
    </footer>
  );
}
