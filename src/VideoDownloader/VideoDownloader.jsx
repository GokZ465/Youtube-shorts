import { useState } from "react";

const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const handleDownload = () => {
    const apiUrl = `http://localhost:3000/download?url=${encodeURIComponent(
      videoUrl
    )}`;
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
