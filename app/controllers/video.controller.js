const Video = require("../models/video.models");
const { uploadToS3 } = require("../services/upload-s3-service");
require("dotenv").config();

const VideoController = {
  UploadVideo: async (req, res) => {
    const { title, desc, category, year, limit, director } = req.body;
    try {
      const uploadedFile = await uploadToS3(req.file, "dreadflix-videos");

      if (uploadedFile) {
        const video = new Video({
          title,
          desc,
          category,
          year,
          limit,
          director,
          url: uploadedFile.url,
          createdBy: req.user.id,
        });
        await video.save();
        res.status(201).json({ message: "Video uploaded successfully", video });
      } else {
        console.error("Error uploading video", error);
      }
    } catch (error) {
      res.status(500).json({ message: "Error uploading video", error });
    }
  },
};

module.exports = VideoController;