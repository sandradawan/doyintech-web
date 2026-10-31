import IdCardGenerator from "@/components/tools/office/IdCardGenerator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("id-card-generator");

export default function Page() {
  return <OfficeToolLanding slug="id-card-generator" tool={<IdCardGenerator />} />;
}
