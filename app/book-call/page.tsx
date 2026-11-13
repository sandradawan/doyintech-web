import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import BookCallForm from "@/components/booking/BookCallForm";

const TITLE = "Book a Free 15-Minute Call";
const DESCRIPTION = "Pick a day and time for a free 15-minute call with DoyinTech about your website, app or project. We confirm your slot on WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/book-call" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/book-call" },
};

export default function BookCallPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[860px] px-5 sm:px-6">
          <p className="section-eyebrow">Free discovery call</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[46px]">Book a free 15-minute call</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            Choose a day and time that suits you. We will confirm it on WhatsApp, then talk through what you need, what it costs and how long it takes.
          </p>
          <div className="mt-8">
            <BookCallForm />
          </div>
          <p className="mt-6 text-[13px] text-brand-subtle">Calls run Monday to Saturday, 9am to 6pm Nigeria time. No payment is needed to book.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
