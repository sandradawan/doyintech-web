import StudyTimetable from "@/components/tools/office/StudyTimetable";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("study-timetable-planner");

export default function Page() {
  return <OfficeToolLanding slug="study-timetable-planner" tool={<StudyTimetable />} />;
}
