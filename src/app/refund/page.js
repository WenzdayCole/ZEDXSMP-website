import LegalPage from "@/app/components/LegalPage";
import { RefundPolicyContent } from "@/app/components/PolicyContent";

export const metadata = {
  title: "Refund Policy",
  description:
    "Refunds, immediate digital delivery, and UK cooling-off for ZEDX SMP.",
};

export default function RefundRoute() {
  return (
    <LegalPage
      title="Refund"
      accent="Policy"
      description="Virtual goods, immediate delivery, and statutory rights."
    >
      <RefundPolicyContent />
    </LegalPage>
  );
}
