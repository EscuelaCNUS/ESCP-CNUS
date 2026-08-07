const sharp = require("sharp");
const path = require("path");

const jobs = [
  { file: "public/imagenes/nwslate.png", width: 1920 },
  { file: "public/imagenes/contacto banner.png", width: 1920 },
  { file: "public/imagenes/dirigido.png", width: 1400 },
  { file: "public/imagenes/mujeres.png", width: 1400 },
  { file: "public/imagenes/jovenes.png", width: 1400 },
];

async function run() {
  const fs = require("fs");
  for (const { file, width } of jobs) {
    const before = fs.statSync(file).size;
    const tmp = file + ".opt.png";
    await sharp(file, { limitInputPixels: false })
      .resize({ width, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, quality: 85, adaptiveFiltering: true })
      .toFile(tmp);
    const after = fs.statSync(tmp).size;
    fs.renameSync(tmp, file);
    console.log(
      `${file}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB (${(100 - (after / before) * 100).toFixed(0)}% menor)`
    );
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
