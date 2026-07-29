import type { Metadata } from "next";
import { FavoritesList } from "@/app/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "Saved Japanese Names",
  description: "View Japanese first names, surnames, and full names saved in this browser.",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="container-page themed-page theme-clay">
      <header className="page-intro my-6">
        <h1 className="section-title">Your saved names</h1>
        <p className="mt-3 leading-7 text-[#59645d]">
          A personal collection of full names, first names, and surnames saved
          on this device. No account is required.
        </p>
      </header>
      <FavoritesList />
    </div>
  );
}
