import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.random().toString(36).slice(2) + ext);
  },
});

export const upload = multer({ storage });

export async function compressImage(filePath) {
  const output = filePath.replace(/(\.[\w]+)$/, "-compressed$1");
  await sharp(filePath).resize(800).jpeg({ quality: 80 }).toFile(output);
  fs.unlinkSync(filePath);
  return output;
}
