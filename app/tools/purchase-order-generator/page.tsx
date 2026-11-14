import InvoiceGenerator from "@/components/tools/InvoiceGenerator";
import OpsUpsell from "@/components/ops/OpsUpsell";
import OfficeToolLanding, { officeToolMetadata } from "@/components/tools/office/OfficeToolLanding";

export const metadata = officeToolMetadata("purchase-order-generator");

export default function Page() {
  return <OfficeToolLanding slug="purchase-order-generator" tool={<><InvoiceGenerator initialDocType="PurchaseOrder" /><OpsUpsell /></>} />;
}
