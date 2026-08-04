import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of the Japanese Names reference and name-generation website.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use",
    description: "Terms governing use of the Japanese Names website.",
    url: "/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms of Use",
    description: "Terms governing use of the Japanese Names website.",
  },
};

const headingClass = "text-xl font-semibold text-[#2f4238]";
const copyClass = "mt-3 leading-7 text-[#59645d]";
const listClass = "mt-3 list-disc space-y-2 pl-5 leading-7 text-[#59645d]";

export default function TermsPage() {
  return (
    <div className="container-page themed-page theme-gold">
      <header className="page-intro my-6">
        <p className="eyebrow">Using this website</p>
        <h1 className="section-title mt-2">Terms of Use</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#59645d]">
          These terms explain the conditions for using japanesenames.site and
          its Japanese-name reference and generation tools.
        </p>
        <p className="mt-3 text-sm text-[#647068]">Effective: August 4, 2026</p>
      </header>

      <article className="surface my-10 space-y-10 p-6 sm:p-9">
        <section>
          <h2 className={headingClass}>Acceptance of these terms</h2>
          <p className={copyClass}>
            By accessing or using Japanese Names, you agree to these Terms of
            Use and our{
            " "}
            <Link className="font-semibold text-[#315c4b] underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>
            . If you do not agree, please do not use the website. These terms
            apply to visitors and anyone who uses the site&apos;s tools or content.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Purpose of the service</h2>
          <p className={copyClass}>
            Japanese Names is an educational reference and creative name-generation
            tool. It combines stored surname records, given-name readings, kanji
            spellings, meanings, and editorial context. Generated combinations are
            suggestions, not statements that a name is common, legally available,
            culturally appropriate in every setting, or associated with a particular
            person or family.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Accuracy and responsible use</h2>
          <p className={copyClass}>
            Japanese names can have multiple readings, spellings, histories, and
            regional associations. We work to label evidence and uncertainty, but
            we do not guarantee that every interpretation is complete or error-free.
            Literal kanji meanings do not prove ancestry, personality, social status,
            or a single historical origin.
          </p>
          <p className={copyClass}>
            Before using a name for a child, legal identity, publication, tattoo,
            product, character, or other important purpose, consult a qualified
            native speaker or an appropriate professional and conduct your own
            cultural, legal, and trademark checks.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Permitted and prohibited conduct</h2>
          <p className={copyClass}>You may use the website for lawful personal, educational, and creative purposes. You must not:</p>
          <ul className={listClass}>
            <li>Use the service to violate law or the rights of another person.</li>
            <li>Attempt to disrupt, overload, probe, or gain unauthorized access to the website or its systems.</li>
            <li>Use automated requests in a way that degrades the service or bypasses reasonable access controls.</li>
            <li>Misrepresent generated output as proof of Japanese ancestry, official registration, or professional advice.</li>
            <li>Copy or republish substantial portions of the website in a way that violates applicable rights or source licenses.</li>
          </ul>
        </section>

        <section>
          <h2 className={headingClass}>Content, data, and intellectual property</h2>
          <p className={copyClass}>
            The website&apos;s design, original text, software, organization, and
            editorial presentation are protected by applicable intellectual
            property laws. Some linguistic and reference data comes from third-party
            or public sources and remains subject to its original terms and licenses.
            Sources and important limitations are described on the{
            " "}
            <Link className="font-semibold text-[#315c4b] underline underline-offset-4" href="/about">
              About our data
            </Link>
            {
              " "
            }
            page. Nothing in these terms changes a third party&apos;s license or ownership rights.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Favorites and browser features</h2>
          <p className={copyClass}>
            Favorites are stored locally in your browser. We do not guarantee that
            saved items will remain available after browser data is cleared, a device
            changes, or the website is updated. You are responsible for keeping any
            information you need elsewhere.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Third-party services and advertising</h2>
          <p className={copyClass}>
            The website may use third-party analytics, hosting, links, or advertising
            services, including Google services. Third parties operate under their
            own terms and privacy policies. Advertising does not constitute our
            endorsement of an advertiser, product, or claim. See our{
            " "}
            <Link className="font-semibold text-[#315c4b] underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>
            {
              " "
            }
            for information about cookies and advertising choices.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Availability and changes</h2>
          <p className={copyClass}>
            We may correct, update, suspend, restrict, or discontinue any part of
            the website at any time. We do not promise uninterrupted availability
            or that a particular name, feature, or saved link will remain unchanged.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Disclaimer of warranties</h2>
          <p className={copyClass}>
            To the extent permitted by law, the website is provided “as is” and “as
            available,” without warranties of accuracy, completeness, fitness for a
            particular purpose, non-infringement, or uninterrupted operation. Nothing
            on the website is legal, genealogical, linguistic, naming, or other
            professional advice.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Limitation of liability</h2>
          <p className={copyClass}>
            To the extent permitted by applicable law, Japanese Names and its
            operators will not be liable for indirect, incidental, special,
            consequential, or punitive damages, or for loss arising from reliance on
            generated names, meanings, historical interpretations, third-party
            services, or loss of browser-stored favorites. Rights that cannot legally
            be excluded remain unaffected.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Changes to these terms</h2>
          <p className={copyClass}>
            We may update these terms when the website or applicable requirements
            change. The effective date at the top identifies the current version.
            Continued use after an update means you accept the revised terms to the
            extent permitted by law.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Contact</h2>
          <p className={copyClass}>
            Questions about these terms may be sent using the details on our{
            " "}
            <Link className="font-semibold text-[#315c4b] underline underline-offset-4" href="/contact">
              Contact page
            </Link>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
