export type ServiceItem = {
  slug: string;
  title: string;
  short: string;
  desc: string;
  img: string;
  href: string;
  tags: string[];
  featured?: boolean;
};

/** Real photography via Unsplash (free license) — not AI art, not scraped Pinterest. */
export const SERVICES: ServiceItem[] = [
  {
    slug: "web",
    title: "Web App Development",
    short: "High-performance websites & web apps",
    desc: "Responsive business websites, portals, and web applications built for speed, SEO, and conversion — Next.js, Laravel, and modern stacks.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    href: "/contact?service=web",
    tags: ["Next.js", "Laravel", "SEO"],
    featured: true,
  },
  {
    slug: "backend",
    title: "Backend Engineering",
    short: "APIs, databases & scalable servers",
    desc: "Production backends with Laravel, PHP, Node.js, MySQL and PostgreSQL — secure auth, queues, caching, and systems that scale with your business.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
    href: "/services/backend",
    tags: ["Laravel", "PHP", "MySQL", "Node"],
    featured: true,
  },
  {
    slug: "api",
    title: "API Development & Integration",
    short: "Secure REST APIs & third-party connects",
    desc: "Well-documented APIs, payment gateways, WhatsApp, SMS, and system integrations with authentication, rate limits, and monitoring.",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
    href: "/contact?service=api",
    tags: ["REST", "Integrations", "Webhooks"],
    featured: true,
  },
  {
    slug: "mobile",
    title: "Mobile App Development",
    short: "Flutter apps for iOS & Android",
    desc: "Cross-platform Flutter apps with clean architecture, offline support, smooth UX, and app-store ready delivery.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58d7dde?auto=format&fit=crop&w=1400&q=80",
    href: "/services/mobile",
    tags: ["Flutter", "iOS", "Android"],
    featured: true,
  },
  {
    slug: "lan",
    title: "LAN Network Design & Configuration",
    short: "Office LAN design, setup & configuration",
    desc: "Local area network design, implementation, and configuration for offices and organisations — structured cabling planning, switches, routers, Wi‑Fi, IP addressing, VLANs, and reliable day‑to‑day connectivity.",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=1400&q=80",
    href: "/contact?service=lan-network",
    tags: ["LAN", "Networking", "Wi‑Fi", "Office IT"],
    featured: true,
  },
  {
    slug: "ai",
    title: "AI Automation",
    short: "Chatbots, workflows & smart tools",
    desc: "Practical AI for SMEs — website chatbots, WhatsApp automation, lead qualification, and process automation that saves hours every week.",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    href: "/services/ai-automation",
    tags: ["Chatbots", "WhatsApp", "Automation"],
    featured: true,
  },
  {
    slug: "security",
    title: "Website Security & Hardening",
    short: "Scans, headers, SSL & monitoring",
    desc: "Security reviews, hardening, SSL, headers, email auth (SPF/DMARC), vulnerability checks, and ongoing monitoring for your domains.",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80",
    href: "/tools/org-security",
    tags: ["Security", "SSL", "Monitoring"],
    featured: true,
  },
  {
    slug: "system",
    title: "System Design & Consulting",
    short: "Architecture for growing products",
    desc: "Cloud and server architecture, data models, scaling plans, and technical consulting so your product does not break as users grow.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    href: "/contact?service=system",
    tags: ["Architecture", "Cloud", "Consulting"],
  },
  {
    slug: "uiux",
    title: "UI/UX Product Design",
    short: "Interfaces users actually enjoy",
    desc: "Wireframes, design systems, and polished UI for web and mobile — focused on clarity, accessibility, and conversion.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80",
    href: "/contact?service=uiux",
    tags: ["UI/UX", "Design systems"],
  },
  {
    slug: "ecommerce",
    title: "E‑commerce & Client Portals",
    short: "Stores, dashboards & member areas",
    desc: "Online stores, client portals, booking systems, and dashboards — payments, roles, and admin tools tailored to your operations.",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80",
    href: "/contact?service=ecommerce",
    tags: ["E‑commerce", "Portals", "Payments"],
  },
  {
    slug: "database",
    title: "Database Design & Optimization",
    short: "MySQL, PostgreSQL & data models",
    desc: "Schema design, query tuning, migrations, and reliable data layers for apps that cannot afford downtime or messy data.",
    img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=80",
    href: "/contact?service=database",
    tags: ["MySQL", "PostgreSQL", "Performance"],
  },
  {
    slug: "maintenance",
    title: "Maintenance & Support",
    short: "Updates, backups & care plans",
    desc: "Ongoing website and app care — updates, backups, small features, uptime checks, and a team you can message when something breaks.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80",
    href: "/tools/maintenance-picker",
    tags: ["Support", "Updates", "Backups"],
  },
  {
    slug: "training",
    title: "Tech Training & Mentorship",
    short: "Teams and individuals upskilled",
    desc: "Practical training on web, backend, mobile, and AI tooling — for teams and individuals who want production skills, not theory only.",
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80",
    href: "https://doyintechacademy.vercel.app",
    tags: ["Academy", "Mentorship"],
  },
];

export const FEATURED_SERVICES = SERVICES.filter((s) => s.featured);
