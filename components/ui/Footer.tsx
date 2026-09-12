"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Shop and Learn",
      links: [
        ["/services", "Services"],
        ["/tools", "Free Tools"],
        ["/portfolio", "Portfolio"],
        ["/blog", "Blog"],
      ],
    },
    {
      title: "Company",
      links: [
        ["/about", "About"],
        ["/company-profile", "Company Profile"],
        ["/contact", "Contact"],
        ["https://doyintechacademy.vercel.app", "Academy"],
      ],
    },
    {
      title: "Legal",
      links: [
        ["/privacy", "Privacy Policy"],
        ["/terms", "Terms of Use"],
      ],
    },
  ];

  return (
    <footer className="border-t border-black/10 bg-[#f5f5f7] text-[12px] text-[#6e6e73]">
      <div className="mx-auto max-w-[980px] px-6 py-10">
        <div className="rounded-[28px] bg-black px-8 py-12 text-center text-white sm:px-12">
          <h2 className="text-[32px] font-semibold tracking-tight sm:text-[40px]">
            Let’s build what’s next.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[17px] text-[#a1a1a6]">
            Websites, apps, APIs, automation, and security — engineered with care.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/contact" className="apple-btn apple-btn-primary">
              Contact us
            </a>
            <a href="/tools" className="apple-btn apple-btn-secondary">
              Free tools ›
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 font-semibold text-[#1d1d1f]">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="hover:text-[#1d1d1f] hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-black/10 pt-6">
          <p>
            More ways to shop: visit{" "}
            <a href="/contact" className="apple-link">
              Contact
            </a>{" "}
            or call{" "}
            <a href="tel:+2348085343926" className="apple-link">
              +234 808 534 3926
            </a>
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 border-t border-black/10 pt-4 text-[12px] sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright © {year} DoyinTech. All rights reserved.</p>
            <p className="flex flex-wrap gap-3">
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
              <span className="text-black/20">|</span>
              <a href="/terms" className="hover:underline">
                Terms of Use
              </a>
              <span className="text-black/20">|</span>
              <span>Jos, Nigeria</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
