import { getSiteUrl } from "@/lib/site-url";

export default function sitemap() {
  const siteUrl = getSiteUrl();
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
