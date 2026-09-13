"use client";

import ContactCta from "@/components/ui/ContactCta";

export default function LeadForm({
  tool,
  resultSummary,
}: {
  tool: string;
  resultSummary?: string;
  defaultMessage?: string;
}) {
  const subject = resultSummary
    ? `Help with ${tool}: ${resultSummary}`
    : `Help after using ${tool} tool — DoyinTech`;

  return (
    <ContactCta
      title="Want help improving your results?"
      subtitle="No forms. Email us or book a free discovery call."
      emailSubject={subject}
    />
  );
}
