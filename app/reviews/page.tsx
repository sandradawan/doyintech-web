import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import ReviewForm from "@/components/reviews/ReviewForm";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Leave a review — DoyinTech",
  description:
    "Share your experience working with DoyinTech. Help other Nigerian SMEs choose with confidence.",
};

export default function ReviewsPage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[640px] px-6">
          <p className="section-eyebrow">Social proof</p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            Leave a review
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
            Finished a project with us? Your honest feedback helps other businesses
            decide — and helps us improve.
          </p>

          <div className="mt-10">
            <ReviewForm />
          </div>

          <p className="mt-8 text-center text-[13px] text-[#a1a1a6]">
            Prefer WhatsApp?{" "}
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-link"
            >
              Message us
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
