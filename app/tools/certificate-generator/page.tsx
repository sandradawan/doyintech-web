import CertificateGenerator from "@/components/tools/office/CertificateGenerator";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("certificate-generator");

export default function Page() {
  return <OfficeToolLanding slug="certificate-generator" tool={<CertificateGenerator />} />;
}
