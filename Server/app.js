const express = require("express");
const ytdl = require("ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require("fs");
const app = express();
const port = 3000;

app.get("/play", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  try {
    const videoId = ytdl.getURLVideoID(videoUrl);
    const videoInfo = await ytdl.getInfo(videoId);
    const videoLength = parseInt(videoInfo.videoDetails.lengthSeconds);

    // Generate the URLs for the 30-second clips
    const clips = [];
    let start = 10;
    let end = start + 30;

    while (end <= videoLength) {
      const clipUrl = `/video?url=${encodeURIComponent(
        videoUrl
      )}&start=${start}&end=${end}`;
      clips.push(clipUrl);

      start += 30;
      end = start + 30;
    }

    res.send(`
      <html>
        <body>
          <h1>YouTube Video Player</h1>
          ${clips
            .map(
              (clipUrl) => `
              <video controls>
                <source src="${clipUrl}" type="video/mp4">
              </video>
              <br>
            `
            )
            .join("")}
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: "Failed to load video" });
  }
});


app.get("/video", async (req, res) => {
  const videoUrl = req.query.url;
  const start = parseInt(req.query.start);
  const end = parseInt(req.query.end);
  //   const duration = end - start;
  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  try {
    const videoId = ytdl.getURLVideoID(videoUrl);
    const videoInfo = await ytdl.getInfo(videoId);
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highest",
      filter: "audioandvideo", // Include both audio and video streams
    });

    // Download the video using ytdl
    const videoStream = ytdl(videoUrl, { format: videoFormat });

    // Create a unique file name for the cropped video
    const fileName = `${videoId}.mp4`;

    // Create a new ffmpeg command
    const command = ffmpeg(videoStream)
      .format("mp4")
      .setStartTime(start)
      .setDuration(end - start) // Set the duration of the cropped video (30 seconds)
      .on("error", (err) => {
        console.error("Error during video cropping:", err);
        res.status(500).json({ error: "Failed to crop video" });
      })
      .on("end", () => {
        // Once the video is cropped, send it as a response
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="video.mp4"`
        );
        res.setHeader("Content-Type", "video/mp4");

        // Read the cropped video file and send it as the response
        fs.createReadStream(fileName).pipe(res);
      });

    // Save the cropped video to a file
    command.save(fileName);
  } catch (error) {
    console.error("Error during video download:", error);
    res.status(500).json({ error: "Failed to download video" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
