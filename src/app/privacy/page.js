import LegalPage from "@/app/components/LegalPage";
import { PrivacyPolicyContent } from "@/app/components/PolicyContent";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How ZEDX SMP collects and uses personal data on shop.zedxsmp.fun.",
};

export default function PrivacyRoute() {
  return (
    <LegalPage
      title="Privacy"
      accent="Policy"
      description="What we collect, why we use it, and how to contact us."
    >
      <PrivacyPolicyContent />
    </LegalPage>
  );
}
