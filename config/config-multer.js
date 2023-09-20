const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const app = express();
const multer = require("multer");
const gravatar = require("gravatar");

const uploadDir = path.join(process.cwd(), "uploads");
const storeImage = path.join(process.cwd(), "images");

const addNewUser = async () => {
  const email = "jasonderulo@gmail.com";
  const url = gravatar.url(email, {
    s: "400",
    r: "x",
    d: "robohash",
  });

  console.log(url);
};
addNewUser();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

app.post("/upload", upload.single("picture"), async (req, res, next) => {
  const { description } = req.body;
  console.log(req.file);
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(storeImage, originalname);
  console.log(fileName);

  try {
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }

  res.json({ description, message: "File uploaded successfully", status: 200 });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  createFolderIsNotExist(uploadDir);
  createFolderIsNotExist(storeImage);
  console.log(`Server running. Use on port:${PORT}`);
});
