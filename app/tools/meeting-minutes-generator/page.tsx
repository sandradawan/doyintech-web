import MinutesGenerator from "@/components/tools/office/MinutesGenerator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("meeting-minutes-generator");

export default function Page() {
  return <OfficeToolLanding slug="meeting-minutes-generator" tool={<MinutesGenerator />} />;
}
