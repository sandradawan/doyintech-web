import Footer from "@/components/ui/Footer";

export const metadata = { alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How DoyinTech collects, uses and protects your personal data when you use our website, tools and services, and the choices and rights you have.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-headings:font-display">
          <h1 className="font-display text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-brand-muted mt-4">Last updated: August 2026</p>

          <div className="mt-10 space-y-8 text-brand-soft leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p>
                When you contact us through our website forms, we collect the information you voluntarily provide — such as your name, email address, phone number, and project details. We also collect basic technical data (IP address, browser type) for security and analytics purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information solely to respond to your inquiries, provide quotes, deliver services, and improve our website. We do not sell or rent your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Cookies</h2>
              <p>
                We use essential cookies necessary for the website to function and optional analytics cookies. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Data Security</h2>
              <p>
                We implement reasonable technical and organisational measures to protect your data against unauthorised access, loss or misuse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Community Posts</h2>
              <p>
                If you post in the DoyinTech Community, your display name and post are public once approved. Your email address is not shown to other members: we use it for sign-in and to tell you when your post goes live or gets a reply. To have a post removed, contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
              <p>
                For any privacy-related questions, please email us at{" "}
                <a href="mailto:hello@doyintech.com" className="text-primary hover:underline">
                  hello@doyintech.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
