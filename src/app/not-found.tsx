import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Name Record Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <span className="seal mx-auto" aria-hidden="true">無</span>
      <p className="eyebrow mt-6">404 · Not found</p>
      <h1 className="section-title mt-3">This name record does not exist</h1>
      <p className="mx-auto mt-4 max-w-lg leading-7 text-[#647068]">
        The slug may be invalid, or the record may not have been added to the
        structured dataset.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Link className="button-primary" href="/#generator">Open generator</Link>
        <Link className="button-secondary" href="/japanese-last-names">Browse surnames</Link>
      </div>
    </div>
  );
}
