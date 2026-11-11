/**
 * Students we have worked with. The hero on /students slides through `banner`,
 * and the magazine shows `photo`, `name` and `school`.
 *
 * To add a student: put a 1920x1080 banner and a 4:5 portrait in public/students,
 * then add an entry here. Leave `name` or `school` empty and that line is simply not shown.
 * Only add someone who has agreed to appear on the site.
 */
export type StudentSpotlight = {
  id: string;
  name: string;
  school: string;
  /** What we did together, in a few words. */
  work: string;
  banner: string;
  bannerAlt: string;
  photo: string;
};

export const STUDENT_SPOTLIGHTS: StudentSpotlight[] = [
  {
    id: "fcahpt-vom-research-writing",
    name: "",
    school: "FCAHPT Vom",
    work: "Project research and writing",
    banner: "/students/thank-you-1.webp",
    bannerAlt: "Thank you for trusting and recommending DoyinTech for project research and writing at FCAHPT Vom.",
    photo: "/students/portrait-1.webp",
  },
  {
    id: "research-software-development",
    name: "",
    school: "",
    work: "Project research software development",
    banner: "/students/thank-you-2.webp",
    bannerAlt: "Thank you for trusting and recommending DoyinTech for project research software development.",
    photo: "/students/portrait-2.webp",
  },
];

/** Shown on the magazine masthead. Change it when you publish a new batch. */
export const MAGAZINE_ISSUE = { number: "01", date: "November 2026" };
