import { getBrowseableSurnames } from "@/lib/names";
import { BROWSE_PAGE_SIZE } from "@/lib/browse";
export { default, generateMetadata } from "../../page";
export function generateStaticParams() {
  return Array.from({ length: Math.ceil(getBrowseableSurnames().length / BROWSE_PAGE_SIZE) - 1 }, (_, i) => ({ page: String(i + 2) }));
}
