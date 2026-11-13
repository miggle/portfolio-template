// Builds the published site into dist/ from the files in this repo.
// It fills in the page title, search and link-preview tags, favicon, CNAME and
// robots.txt from content.js, so content.js is the only file that changes per person.
// No packages needed: run with `node tools/build.mjs`.

import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const site = vm.runInNewContext(readFileSync(join(root, "content.js"), "utf8") + "\n;site");

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

const domain = String(site.domain || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const base = domain ? `https://${domain}/` : "";
const theme = site.theme || {};
const title = site.role ? `${site.name} · ${site.role}` : site.name;
const description =
  site.description ||
  [[site.role, site.location].filter(Boolean).join(", "), ...(site.lines || [])]
    .filter(Boolean)
    .join(". ")
    .replace(/\.\./g, ".");

const shareImage = site.shareImage
  ? (base ? base + site.shareImage.replace(/^\//, "") : site.shareImage) +
    (site.rev ? `?v=${encodeURIComponent(site.rev)}` : "")
  : "";

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  ...(site.role && { jobTitle: site.role }),
  ...(base && { url: base }),
  ...(shareImage && base && { image: shareImage }),
};

const tags = [
  `<title>${esc(title)}</title>`,
  `<meta name="description" content="${esc(description)}" />`,
  site.hideFromSearch ? `<meta name="robots" content="noindex" />` : "",
  base ? `<link rel="canonical" href="${esc(base)}" />` : "",
  `<meta property="og:title" content="${esc(site.name)}" />`,
  `<meta property="og:description" content="${esc(description)}" />`,
  `<meta property="og:type" content="profile" />`,
  `<meta property="og:site_name" content="${esc(site.name)}" />`,
  base ? `<meta property="og:url" content="${esc(base)}" />` : "",
  shareImage ? `<meta property="og:image" content="${esc(shareImage)}" />` : "",
  shareImage ? `<meta property="og:image:alt" content="${esc("A photo from " + site.name + "'s portfolio")}" />` : "",
  `<meta name="twitter:card" content="${shareImage ? "summary_large_image" : "summary"}" />`,
  `<meta name="theme-color" content="${esc(theme.paper || "#f4efe4")}" />`,
  site.hideFromSearch
    ? ""
    : `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>`,
]
  .filter(Boolean)
  .map((tag) => "    " + tag)
  .join("\n");

const html = readFileSync(join(root, "index.html"), "utf8");
const marker = /<!-- meta:start[\s\S]*?<!-- meta:end -->/;
if (!marker.test(html)) throw new Error("index.html is missing the meta:start / meta:end markers");

const initial = String(site.name || "?").trim().charAt(0).toUpperCase();
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${esc(theme.ink || "#221b16")}"/>
  <rect x="7" y="5.5" width="8" height="1.5" fill="${esc(theme.accent || "#8f3b28")}"/>
  <text x="16" y="25.5" text-anchor="middle" font-family="Palatino, Georgia, serif" font-size="22" fill="${esc(theme.paper || "#f4efe4")}">${esc(initial)}</text>
</svg>
`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
for (const file of ["content.js", "styles.css", ".nojekyll"]) {
  cpSync(join(root, file), join(dist, file));
}
if (existsSync(join(root, "images"))) {
  cpSync(join(root, "images"), join(dist, "images"), { recursive: true });
}
writeFileSync(join(dist, "index.html"), html.replace(marker, tags.trimStart()));
writeFileSync(join(dist, "favicon.svg"), favicon);
writeFileSync(
  join(dist, "robots.txt"),
  site.hideFromSearch ? "User-agent: *\nDisallow: /\n" : "User-agent: *\nAllow: /\n"
);
if (domain) writeFileSync(join(dist, "CNAME"), domain + "\n");

console.log(`Built ${site.name} into dist/${domain ? " for " + domain : ""}`);
