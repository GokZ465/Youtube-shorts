import { useState } from "react";

const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleDownload = () => {
    const numClips = 2; // Number of clips you want to generate
    const clipDuration = 30; // Duration of each clip in seconds

    let apiUrl = `http://localhost:3000/play?url=${encodeURIComponent(
      videoUrl
    )}&clips=${numClips}`;

    for (let i = 0; i < numClips; i++) {
      const start = i * clipDuration;
      const end = (i + 1) * clipDuration;
      apiUrl += `&start${i + 1}=${start}&end${i + 1}=${end}`;
    }

    window.open(apiUrl, "_blank");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter video URL"
        value={videoUrl}
        onChange={handleInputChange}
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default VideoDownloader;
