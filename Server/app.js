const express = require("express");
const fs = require("fs");
const ytdl = require("ytdl-core");
const app = express();
const port = 3000;

app.get("/download", (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  const videoId = ytdl.getURLVideoID(videoUrl);
  const videoStream = ytdl(videoId, { quality: "highest" });

  res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
  videoStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
