import multer from "multer";
import { generate } from "../app/id.js";
import path from "path";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExtensions = [".png", ".jpg", ".jpeg"];
    if (!allowedExtensions.includes(ext.toLowerCase())) {
      return cb(new Error("Invalid file type"));
    }
    const uniqueFilename = (await generate.ohter_id()) + ext;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  cb(null, allowedMimeTypes.includes(file.mimetype));
};

export const multers = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("images");
