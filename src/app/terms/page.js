import LegalPage from "@/app/components/LegalPage";
import { TermsPolicyContent } from "@/app/components/PolicyContent";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms for using ZEDX SMP, the Minecraft server, and shop.zedxsmp.fun.",
};

export default function TermsRoute() {
  return (
    <LegalPage
      title="Terms of"
      accent="Service"
      description="Rules, digital purchases, and how the shop is operated."
    >
      <TermsPolicyContent />
    </LegalPage>
  );
}
