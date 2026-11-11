/**
 * Students we have worked with. The hero on /students slides through them,
 * and the magazine shows each one's photo, name and school tag.
 *
 * New students are added at /admin/student-magazine (stored in Supabase).
 * The two below are built in, so the page is never empty.
 * Only add someone who has agreed to appear on the site.
 */
export type StudentSpotlight = {
  id: string;
  /** Empty hides the name line. */
  name: string;
  /** Shown as a tag, e.g. "FCAHPT Vom". Empty hides the tag. */
  school: string;
  /** What we did together, in a few words. */
  work: string;
  photo: string;
  /** A ready-made 16:9 banner. Without one, the slideshow draws a slide from the photo, name and school. */
  banner?: string;
  bannerAlt?: string;
};

export const BUILT_IN_SPOTLIGHTS: StudentSpotlight[] = [
  {
    id: "fcahpt-vom-research-writing",
    name: "",
    school: "FCAHPT Vom",
    work: "Project research and writing",
    photo: "/students/portrait-1.webp",
    banner: "/students/thank-you-1.webp",
    bannerAlt: "Thank you for trusting and recommending DoyinTech for project research and writing at FCAHPT Vom.",
  },
  {
    id: "research-software-development",
    name: "",
    school: "",
    work: "Project research software development",
    photo: "/students/portrait-2.webp",
    banner: "/students/thank-you-2.webp",
    bannerAlt: "Thank you for trusting and recommending DoyinTech for project research software development.",
  },
];

/** Shown on the magazine masthead. Change it when you publish a new batch. */
export const MAGAZINE_ISSUE = { number: "01", date: "November 2026" };
