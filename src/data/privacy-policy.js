import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_DISCORD_URL,
  LEGAL_OPERATOR,
  LEGAL_SHOP_HOST,
} from "@/data/legal";

/** Privacy Policy sections for /privacy */
export const privacySections = [
  {
    title: "1. Who we are",
    paragraphs: [
      `${LEGAL_OPERATOR} operates this shop at ${LEGAL_SHOP_HOST} and the related Minecraft server at zedxsmp.fun. We are an unincorporated Minecraft community shop run by the ZEDX SMP team. We are not a registered company and we do not publish a Companies House or VAT number.`,
      `Questions about this policy or your data: ${LEGAL_CONTACT_EMAIL}. You can also reach us on Discord: ${LEGAL_DISCORD_URL}`,
    ],
  },
  {
    title: "2. What we collect",
    intro: "Depending on how you use the shop, we may process:",
    bullets: [
      "Minecraft in-game name (IGN) and, if you log in, the UUID returned by our server plugin",
      "Optional email if you enter one at login, or the email Stripe collects at checkout",
      "Purchase records (what you bought, when, Stripe customer/session/subscription IDs, Minecraft username used for delivery)",
      "A session cookie if you log in to the shop (see our Cookie Notice)",
      "Technical request data such as IP address used for rate limiting and fraud prevention",
      "Payment card details are handled by Stripe. We do not store full card numbers on our servers",
    ],
    paragraphs: [
      "The shop login is Minecraft username and password verified against our server. We do not use Discord OAuth on the shop. If you join the ZEDX SMP Discord, Discord processes that data under Discord’s own terms.",
    ],
  },
  {
    title: "3. Why we use it",
    bullets: [
      "To take payment and fulfil orders (ranks, crate keys, and other virtual goods) on the Minecraft server",
      "To revoke a paid rank if a subscription ends, except where a rank was replaced by a newer purchase",
      "To keep you logged in, prevent abuse, and handle customer support or chargebacks",
      "To keep records we reasonably need for accounting and legal claims",
    ],
    paragraphs: [
      "We rely on steps needed to perform the contract (your purchase), our legitimate interests in running a secure shop, and legal obligations where they apply.",
    ],
  },
  {
    title: "4. Who we share it with",
    intro: "We do not sell your personal data. We share only what is needed with:",
    bullets: [
      "Stripe — payments, billing portal, and checkout",
      "Our hosting provider — to run this website",
      "Our Minecraft server plugin — to deliver or revoke ranks and keys in-game",
      "Discord — only if you contact us there; we do not send shop checkout data to Discord automatically",
    ],
  },
  {
    title: "5. International transfers",
    paragraphs: [
      "Some processors (including Stripe) may handle data outside the UK. Where that happens, they use appropriate safeguards such as standard contractual clauses or equivalent protections required by UK data protection law.",
    ],
  },
  {
    title: "6. How long we keep it",
    paragraphs: [
      "We keep purchase and fulfilment records for as long as needed to deliver the product, handle disputes, prevent fraud, and meet accounting or legal requirements. Session cookies last until they expire or you log out. You can ask us to delete account-related data we control; we may retain a limited record where the law requires it.",
    ],
  },
  {
    title: "7. Your rights (UK GDPR)",
    paragraphs: [
      "If UK data protection law applies, you can ask for access to your personal data, correction, erasure, restriction, objection, or a copy in a portable format. You can also complain to the ICO (ico.org.uk). To exercise rights, email us at the address above and include the Minecraft username used in the shop.",
    ],
  },
  {
    title: "8. Children and age",
    paragraphs: [
      "Minecraft and Discord have their own age rules. This shop sells digital content paid for with a payment card. You must be allowed to use Minecraft (and Discord if you use it). The person paying must be old enough to use the payment method (typically 18) or a parent or guardian must pay.",
      "We do not knowingly take card payments from children. If you believe a child has provided personal data through this shop, contact us and we will delete it where we can.",
    ],
  },
  {
    title: "9. Cookies",
    paragraphs: [
      "If you log in, we set a session cookie so the shop can keep you signed in. Stripe may set its own cookies on Stripe Checkout. The basket is saved in your browser. We do not use advertising or analytics cookies.",
    ],
  },
];
