const Video = require("../models/video.models");
const { uploadToAzureBlob } = require("../services/upload-azure-service");
require("dotenv").config();

const VideoController = {
  UploadVideo: async (req, res) => {
    const { title, desc, category, year, limit, director } = req.body;
    try {
      const url = await uploadToAzureBlob(req.file);

      if (url) {
        const video = new Video({
          title,
          desc,
          category,
          year,
          limit,
          director,
          url: url,
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
