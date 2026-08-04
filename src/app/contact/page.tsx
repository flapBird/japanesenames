import type { Metadata } from "next";
import Link from "next/link";

const contactEmail = "contact@japanesenames.site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Japanese Names about corrections, privacy, copyright, technical issues, or general questions.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Japanese Names",
    description:
      "Contact us about corrections, privacy, copyright, technical issues, or general questions.",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact Japanese Names",
    description:
      "Contact us about corrections, privacy, copyright, technical issues, or general questions.",
  },
};

export default function ContactPage() {
  return (
    <div className="container-page themed-page theme-moss">
      <header className="page-intro my-6">
        <p className="eyebrow">Questions and corrections</p>
        <h1 className="section-title mt-2">Contact Japanese Names</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#59645d]">
          Get in touch about a name entry, source, privacy request, copyright
          concern, technical problem, or general question.
        </p>
      </header>

      <div className="my-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="surface p-6 sm:p-8">
          <p className="eyebrow">Email</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#2f4238]">Send us a message</h2>
          <p className="mt-4 leading-7 text-[#59645d]">
            Email{
            " "}
            <a
              className="font-semibold text-[#315c4b] underline underline-offset-4"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
            . Include the relevant page URL and enough detail for us to understand
            the request. Please do not send passwords, government identifiers,
            financial information, or other sensitive personal information.
          </p>
          <a className="button-primary mt-6" href={`mailto:${contactEmail}`}>
            Email Japanese Names
          </a>
        </article>

        <article className="surface p-6 sm:p-8">
          <p className="eyebrow">Helpful details</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#2f4238]">What to include</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-[#59645d]">
            <li>
              <strong>Data correction:</strong> the name, spelling, page URL,
              suggested correction, and a reliable source where possible.
            </li>
            <li>
              <strong>Technical issue:</strong> the page, what happened, device,
              browser, and steps that reproduce the problem.
            </li>
            <li>
              <strong>Privacy request:</strong> the right you want to exercise and
              enough information for us to verify and locate the relevant record.
            </li>
            <li>
              <strong>Copyright concern:</strong> the protected work, affected URL,
              your authority to act, and your preferred contact details.
            </li>
          </ul>
        </article>
      </div>

      <section className="surface mb-16 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-[#2f4238]">Before contacting us</h2>
        <p className="mt-3 leading-7 text-[#59645d]">
          Our{
          " "}
          <Link className="font-semibold text-[#315c4b] underline underline-offset-4" href="/about">
            About our data
          </Link>
          {
            " "
          }
          page explains evidence labels and the limits of literal meanings. Our{
          " "}
          <Link className="font-semibold text-[#315c4b] underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>
          {
            " "
          }
          explains how contact messages and website data are handled.
        </p>
      </section>
    </div>
  );
}
