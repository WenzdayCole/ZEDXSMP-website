import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "src/app/icon.png");

async function main() {
  const sizes = [
    { size: 16, name: "favicon-16.png" },
    { size: 32, name: "favicon-32.png" },
    { size: 180, name: "apple-icon.png" },
    { size: 512, name: "favicon.png" },
  ];

  for (const { size, name } of sizes) {
    const out = resolve(root, "public", name);
    await sharp(src).resize(size, size).png().toFile(out);
    if (size === 32) {
      await sharp(src).resize(size, size).png().toFile(resolve(root, "src/app/icon.png"));
    }
    if (size === 180) {
      await sharp(src)
        .resize(size, size)
        .png()
        .toFile(resolve(root, "src/app/apple-icon.png"));
    }
  }

  const ico = await pngToIco([
    resolve(root, "public/favicon-16.png"),
    resolve(root, "public/favicon-32.png"),
  ]);
  writeFileSync(resolve(root, "public/favicon.ico"), ico);
  writeFileSync(resolve(root, "src/app/favicon.ico"), ico);
  console.log("Favicons generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
