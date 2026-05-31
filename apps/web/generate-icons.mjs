import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = readFileSync(join(__dirname, "public/logo.svg"));

// Web icons
await sharp(svg).resize(1024, 1024).png().toFile(join(__dirname, "public/icon-1024.png"));
await sharp(svg).resize(512, 512).png().toFile(join(__dirname, "public/icon-512.png"));
await sharp(svg).resize(192, 192).png().toFile(join(__dirname, "public/icon-192.png"));

// Flat PNG for @capacitor/assets
await sharp(svg).resize(1024, 1024).png().toFile(join(__dirname, "assets/icon.png"));

// Android launcher icon sizes
const androidRes = join(__dirname, "android/app/src/main/res");
const sizes = [
  { dir: "mipmap-mdpi",    px: 48,  fg: 108 },
  { dir: "mipmap-hdpi",    px: 72,  fg: 162 },
  { dir: "mipmap-xhdpi",   px: 96,  fg: 216 },
  { dir: "mipmap-xxhdpi",  px: 144, fg: 324 },
  { dir: "mipmap-xxxhdpi", px: 192, fg: 432 },
];

for (const { dir, px, fg } of sizes) {
  const dest = join(androidRes, dir);
  mkdirSync(dest, { recursive: true });

  // Square launcher icon
  await sharp(svg).resize(px, px).png().toFile(join(dest, "ic_launcher.png"));
  // Round launcher icon
  await sharp(svg).resize(px, px).png()
    .composite([{
      input: Buffer.from(
        `<svg><circle cx="${px/2}" cy="${px/2}" r="${px/2}" /></svg>`
      ),
      blend: "dest-in",
    }])
    .toFile(join(dest, "ic_launcher_round.png"));
  // Foreground (adaptive icon — transparent background, logo centred at 66%)
  await sharp(svg)
    .resize(Math.round(fg * 0.66), Math.round(fg * 0.66))
    .extend({
      top: Math.round(fg * 0.17),
      bottom: Math.round(fg * 0.17),
      left: Math.round(fg * 0.17),
      right: Math.round(fg * 0.17),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(join(dest, "ic_launcher_foreground.png"));
}

console.log("Icons generated.");
