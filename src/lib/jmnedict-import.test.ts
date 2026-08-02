import { describe, expect, it } from "vitest";
import { parseEntry } from "../../scripts/import-jmnedict";

function entry(types: string, readings: string) {
  return `<entry><ent_seq>42</ent_seq><k_ele><keb>花子</keb></k_ele><k_ele><keb>華子</keb></k_ele>${readings}<trans>${types}</trans></entry>`;
}

describe("JMnedict candidate extraction", () => {
  it("classifies surname, female, male, and unclassified given records only", () => {
    const records = parseEntry(entry("<name_type>&surname;</name_type><name_type>&fem;</name_type><name_type>&masc;</name_type><name_type>&given;</name_type>", "<r_ele><reb>はなこ</reb></r_ele>"));
    expect([...new Set(records.map((item) => item.kind))].sort()).toEqual(["female", "given", "male", "surname"]);
  });

  it("honours reading restrictions instead of producing a spelling-reading Cartesian product", () => {
    const records = parseEntry(entry("<name_type>&fem;</name_type>", "<r_ele><reb>はなこ</reb><re_restr>花子</re_restr></r_ele><r_ele><reb>はなこ</reb><re_restr>華子</re_restr></r_ele>"));
    expect(records.map((item) => item.kanji).sort()).toEqual(["花子", "華子"]);
  });

  it("excludes place, company, and a particular person's full-name entries", () => {
    for (const type of ["place", "company", "person"]) {
      expect(parseEntry(entry(`<name_type>&${type};</name_type>`, "<r_ele><reb>はなこ</reb></r_ele>"))).toEqual([]);
    }
  });
});
