const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shop.zedxsmp.fun";

export default function sitemap() {
  const routes = [
    "",
    "/ranks",
    "/ranks/about",
    "/commands",
    "/rules",
  ];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/ranks" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/ranks" ? 0.9 : 0.7,
  }));
}
