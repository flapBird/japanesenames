import Link from "next/link";
import { BROWSE_PAGE_SIZE, browseHref } from "@/lib/browse";

export function BrowsePagination({ basePath, page, count, filtered, onPageChange }: {
  basePath: string; page: number; count: number; filtered: boolean;
  onPageChange: (page: number) => void;
}) {
  const pages = Math.ceil(count / BROWSE_PAGE_SIZE);
  if (pages <= 1) return null;
  return (
    <nav aria-label="Name list pages" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) =>
        filtered ? (
          <button key={number} type="button" className="button-secondary !min-w-10 !px-3"
            aria-current={number === page ? "page" : undefined}
            disabled={number === page} onClick={() => onPageChange(number)}>
            {number}
          </button>
        ) : (
          <Link key={number} href={browseHref(basePath, number)} prefetch={false}
            aria-label={`Page ${number}`} aria-current={number === page ? "page" : undefined}
            className={`button-secondary !min-w-10 !px-3 ${number === page ? "!bg-[#315c4b] !text-white" : ""}`}>
            {number}
          </Link>
        ),
      )}
      <span className="w-full text-center text-xs text-[#647068]">Page {page} of {pages}</span>
    </nav>
  );
}
