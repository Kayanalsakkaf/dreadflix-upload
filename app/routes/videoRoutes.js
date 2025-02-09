const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const VideoController = require("../controllers/video.controller");
const verify = require("../middleware/verifyToken");
const { log } = require("console");

// Configure Multer
const uploadDirectory = path.join(__dirname, "../uploads");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdir(uploadDirectory, { recursive: true }, (err) => {
        if (err) return cb(err);
        cb(null, uploadDirectory);
      });
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
      log(file);
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only MP4 files are allowed."), false);
    }
  },
});

router.post(
  "/video",
  upload.single("mp4File"),
  verify,
  VideoController.UploadVideo
);

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

module.exports = router;