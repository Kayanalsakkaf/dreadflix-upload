const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    imgSm: { type: String },
    trailer: { type: String },
    year: { type: String },
    limit: { type: Number },
    genre: { type: Array },
    isSeries: { type: Boolean, default: false },
    director: {
      type: String,
      required: true,
    },
    s3Url: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    createdBy: { type: Number },
    category: { type: String },
  },
  { timestamps: true }
);
mongoose.set("debug", true); // Log all MongoDB queries

module.exports = mongoose.model("videos", videoSchema);
