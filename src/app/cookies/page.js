import LegalPage from "@/app/components/LegalPage";
import { CookieNoticeContent } from "@/app/components/PolicyContent";

export const metadata = {
  title: "Cookie Notice",
  description:
    "Cookies and local storage used on the ZEDX SMP shop.",
};

export default function CookiesRoute() {
  return (
    <LegalPage
      title="Cookie"
      accent="Notice"
      description="Session login, Stripe checkout, and what we do not track."
    >
      <CookieNoticeContent />
    </LegalPage>
  );
}
