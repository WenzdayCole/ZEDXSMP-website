import RanksProviders from "./RanksProviders";

export default function RanksLayout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://pay.tebex.io" />
      <link rel="preconnect" href="https://headless.tebex.io" />
      <link rel="dns-prefetch" href="https://js.tebex.io" />
      <RanksProviders>{children}</RanksProviders>
    </>
  );
}
