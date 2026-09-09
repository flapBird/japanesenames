import { firstNames } from "@/data";
import { BROWSE_PAGE_SIZE } from "@/lib/browse";
export { default, generateMetadata } from "../../page";
export function generateStaticParams() {
  const count = firstNames.filter((name) => name.genders.includes("boy") && name.verificationStatus !== "needs_review").length;
  return Array.from({ length: Math.ceil(count / BROWSE_PAGE_SIZE) - 1 }, (_, i) => ({ page: String(i + 2) }));
}
