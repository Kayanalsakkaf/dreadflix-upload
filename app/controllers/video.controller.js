const Video = require("../models/video.models");
const { uploadToS3 } = require("../services/upload-s3-service");
require("dotenv").config();

const VideoController = {
  uploadVideo: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).send("Insufficient Permissions");
    }
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const {
      title,
      desc,
      img,
      imgSm,
      imgTitle,
      trailer,
      year,
      limit,
      genre,
      isSeries,
      director,
      category,
    } = req.body;
    if (!title || !category) {
      return res.status(400).send("Title, category are required.");
    }
    try {
      const s3Data = await uploadToS3(req.file, process.env.S3_BUCKET_NAME);
      if (s3Data) {
        const video = new Video({
          title,
          desc,
          img,
          imgSm,
          imgTitle,
          trailer,
          year,
          limit,
          genre,
          isSeries,
          director,
          s3Url: s3Data.url,
          s3Key: s3Data.eTag,
          createdBy: req.user.id,
          category,
        });
        // Save the video to the database
        await video.save();
        // Send a success response
        res.status(201).json({ message: "Video uploaded successfully", video });
      } else {
        console.error("Error uploading video to s3:", error);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Error uploading video", error });
    }
  },
};

module.exports = VideoController;
