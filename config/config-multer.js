import path from "path";
import multer from "multer";
const pathToTmp = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: pathToTmp,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

export const uploadAvatar = multer({
  storage: storage,
});
