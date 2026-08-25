import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Japanese Names uses browser storage, analytics, cookies, advertising services, and contact information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy",
    description:
      "How Japanese Names handles browser storage, analytics, cookies, advertising, and contact information.",
    url: "/privacy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy",
    description:
      "How Japanese Names handles browser storage, analytics, cookies, advertising, and contact information.",
  },
};

const headingClass = "text-xl font-semibold text-[#2f4238]";
const copyClass = "mt-3 leading-7 text-[#59645d]";
const listClass = "mt-3 list-disc space-y-2 pl-5 leading-7 text-[#59645d]";

export default function PrivacyPage() {
  return (
    <div className="container-page themed-page theme-indigo">
      <header className="page-intro my-6">
        <p className="eyebrow">Your information</p>
        <h1 className="section-title mt-2">Privacy Policy</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#59645d]">
          This policy explains what information Japanese Names collects, why
          it is used, and the choices available to you when you visit
          japanesenames.site.
        </p>
        <p className="mt-3 text-sm text-[#647068]">Last updated: August 24, 2026</p>
      </header>

      <article className="surface my-10 space-y-10 p-6 sm:p-9">
        <section>
          <h2 className={headingClass}>Who we are and what this policy covers</h2>
          <p className={copyClass}>
            Japanese Names operates japanesenames.site, an English-language
            reference and generation tool for Japanese names, readings, kanji
            meanings, and surname context. This policy applies to this website
            and the services offered through it.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Information we collect</h2>
          <ul className={listClass}>
            <li>
              <strong>Browser-stored favorites.</strong> When you save a name,
              the selection and save time are stored in your browser&apos;s local
              storage. This information remains on your device and can be
              removed by deleting favorites or clearing site data.
            </li>
            <li>
              <strong>Usage and device information.</strong> Google Analytics
              may collect pages viewed, referring pages, interaction events,
              timestamps, browser and device details, IP address, and an
              approximate region derived from the IP address. We do not request
              precise GPS location.
            </li>
            <li>
              <strong>Search and tool interactions.</strong> Analytics events
              may include filters, name-record identifiers, generated-name
              interactions, or non-identifying measurements such as search-text
              length. We do not intentionally send the contents of site searches
              to our analytics service. Please do not enter personal information
              into a search field.
            </li>
            <li>
              <strong>AI-assisted name descriptions.</strong> When you use the
              AI Japanese Name Generator, the description you submit is sent to
              the configured AI service so it can extract supported naming
              preferences. We do not send the full description as an analytics
              parameter or intentionally store it in a site database. Please do
              not include sensitive personal information in a description.
            </li>
            <li>
              <strong>Information you send us.</strong> If you email us, we
              receive your email address and the information included in your
              message so that we can respond and keep an appropriate record of
              the request.
            </li>
          </ul>
        </section>

        <section>
          <h2 className={headingClass}>AI-assisted name generation</h2>
          <p className={copyClass}>
            The optional AI parser interprets a description into structured
            fields such as gender, theme, style, and intended use. A configured
            third-party AI provider may process the submitted description under
            its own terms and privacy practices. The language model does not
            create the displayed names: candidate retrieval, ranking, and name
            data come from this site&apos;s structured records.
          </p>
          <p className={copyClass}>
            If the provider is unavailable or not configured, a local keyword
            parser can handle supported terms without sending the description to
            an AI provider. Basic request metadata may be processed for security,
            error handling, and rate limiting.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>How we use information</h2>
          <ul className={listClass}>
            <li>Operate, maintain, secure, and improve the website.</li>
            <li>Understand which pages and tools are useful to visitors.</li>
            <li>Diagnose errors, prevent abuse, and measure site performance.</li>
            <li>Respond to questions, corrections, privacy requests, and legal notices.</li>
            <li>Serve and measure advertising when advertising is enabled.</li>
          </ul>
        </section>

        <section>
          <h2 className={headingClass}>Cookies, analytics, and local storage</h2>
          <p className={copyClass}>
            Cookies are small files stored by a browser. Local storage is a
            similar browser feature used by this site for saved favorites.
            Google Analytics uses cookies or comparable identifiers to measure
            visits and interactions. Google may process this information on our
            behalf under its own terms and privacy practices.
          </p>
          <p className={copyClass}>
            You can restrict or delete cookies and local storage through your
            browser settings. Blocking storage may prevent favorites or some
            measurement features from working. You can also use the{
            " "}
            <a
              className="font-semibold text-[#315c4b] underline underline-offset-4"
              href="https://tools.google.com/dlpage/gaoptout"
              rel="noreferrer"
              target="_blank"
            >
              Google Analytics opt-out browser add-on
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Google AdSense and advertising cookies</h2>
          <p className={copyClass}>
            We may use Google AdSense to display advertising. Third-party
            vendors, including Google, use cookies to serve ads based on a
            visitor&apos;s prior visits to this website or other websites. Google&apos;s
            use of advertising cookies enables Google and its partners to serve
            personalized ads based on visits to this website and other sites on
            the Internet.
          </p>
          <p className={copyClass}>
            Third-party advertising vendors or networks may also place and read
            cookies in your browser, or use web beacons, IP addresses, and other
            identifiers to collect information as a result of ad serving. You
            may opt out of personalized advertising through{
            " "}
            <a
              className="font-semibold text-[#315c4b] underline underline-offset-4"
              href="https://adssettings.google.com/"
              rel="noreferrer"
              target="_blank"
            >
              Google Ads Settings
            </a>
            . You may also review industry opt-out choices at{
            " "}
            <a
              className="font-semibold text-[#315c4b] underline underline-offset-4"
              href="https://optout.aboutads.info/"
              rel="noreferrer"
              target="_blank"
            >
              AboutAds
            </a>
            . Opting out does not remove ads; it may make them less personalized.
          </p>
          <p className={copyClass}>
            Learn more about{
            " "}
            <a
              className="font-semibold text-[#315c4b] underline underline-offset-4"
              href="https://policies.google.com/technologies/partner-sites"
              rel="noreferrer"
              target="_blank"
            >
              how Google uses information from sites that use its services
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Consent choices</h2>
          <p className={copyClass}>
            Where consent is required by applicable law, we use a consent
            mechanism before using non-essential cookies or processing data for
            personalized advertising. Visitors in the European Economic Area,
            the United Kingdom, Switzerland, and other covered regions may be
            shown controls to consent, decline, or manage available choices.
            You may also change browser settings or use the advertising choices
            described above.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>When information is shared</h2>
          <p className={copyClass}>
            Information may be processed by service providers that help us run,
            secure, analyze, or monetize the website, including Google. We may
            also disclose information when reasonably necessary to comply with
            law, protect rights or safety, investigate abuse, or complete a
            business transfer. We do not sell the contents of messages sent to
            our contact address.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Retention and international processing</h2>
          <p className={copyClass}>
            Browser-stored favorites remain until you remove them. Contact
            messages are retained only as long as reasonably needed to respond,
            maintain records, resolve disputes, or meet legal obligations.
            Analytics and advertising data are retained according to the
            settings and policies of the relevant service. Providers may process
            information in countries other than the country where you live.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Your choices and privacy rights</h2>
          <p className={copyClass}>
            Depending on where you live, you may have rights to request access,
            correction, deletion, restriction, or a copy of personal information,
            or to object to certain processing. You can clear favorites directly
            in your browser and manage cookies through browser or consent
            controls. To make a privacy request, use the address on our{
            " "}
            <Link className="font-semibold text-[#315c4b] underline underline-offset-4" href="/contact">
              Contact page
            </Link>
            . We may need to verify a request before completing it.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Children&apos;s privacy</h2>
          <p className={copyClass}>
            This website is a general-audience reference tool and is not directed
            to children under 13. We do not knowingly request personal information
            from children. If you believe a child has sent us personal information,
            please contact us so we can review and delete it where appropriate.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Security, changes, and contact</h2>
          <p className={copyClass}>
            We use reasonable safeguards, but no Internet transmission or storage
            system can be guaranteed completely secure. We may update this policy
            when the site, service providers, or legal requirements change. The
            date at the top will show the latest revision. Questions or requests
            can be sent through our{
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
