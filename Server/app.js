const express = require("express");
const ytdl = require("ytdl-core");
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
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highest",
    });

    res.send(`
      <html>
        <body>
          <h1>YouTube Video Player</h1>
          <video controls>
            <source src="/video?url=${encodeURIComponent(
              videoUrl
            )}" type="video/mp4">
          </video>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: "Failed to load video" });
  }
});

app.get("/video", async (req, res) => {
  const videoUrl = req.query.url;
  const startTime = req.query.start; // Start time in seconds
  const endTime = req.query.end; // End time in seconds

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  try {
    const videoId = ytdl.getURLVideoID(videoUrl);
    const videoInfo = await ytdl.getInfo(videoId);
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highest",
    });

    res.header("Content-Disposition", `attachment; filename="video.mp4"`);
    ytdl(videoUrl, {
      format: videoFormat,
      range: { start: startTime, end: endTime },
    }).pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Failed to download video" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
