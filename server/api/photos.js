const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
module.exports = router;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const storeCloud = file => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.unsigned_upload(
      { tags: "profile", folder: process.env.CLOUD_FOLDER },
      (err, image) => {
        if (err) {
          reject(err);
        }
        resolve(image);
      }
    );
  });
};
const cloudRegex = /cloudinary/;
const deleteCloud = path => {
  if (!cloudRegex.test(path)) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const public_id =
      "bomb-blog/" +
      path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
    cloudinary.uploader.destroy(
      public_id,
      { invalidate: true },
      (result, error) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
};

router.post("/", upload.single("file"), (req, res) => {
  console.log(req.file);
});
