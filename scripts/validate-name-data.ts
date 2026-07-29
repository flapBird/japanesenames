import { firstNames, sources, surnames } from "../src/data";
import { validateNameData } from "../src/lib/validate-data";

const errors = validateNameData({ surnames, firstNames, sources });

if (errors.length > 0) {
  console.error(`Name data validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Name data valid: ${surnames.length} surnames, ${firstNames.length} first-name readings, ${sources.length} sources.`,
);
