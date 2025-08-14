document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById("downloadBtn");
    const urlInput = document.getElementById("urlInput");
    const qualitySelect = document.getElementById("qualitySelect");
    const message = document.getElementById("message");
    const linkBox = document.getElementById("linkBox");
    const videoPlayer = document.getElementById("videoPlayer");

    downloadBtn.addEventListener("click", async () => {
        const url = urlInput.value.trim();
        const quality = qualitySelect.value;

        // Reset previous output
        linkBox.innerHTML = "";
        videoPlayer.src = "";
        message.textContent = "";

        if (!url) {
            message.textContent = "⚠️ Please enter a YouTube URL.";
            return;
        }

        message.textContent = "⏳ Preparing video...";

        try {
            const response = await fetch("/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, quality })
            });

            const data = await response.json();

            if (data.error) {
                message.textContent = "⚠️ Error: " + data.error;
                return;
            }

            // Show download link
            const a = document.createElement("a");
            a.href = data.download_url;
            a.download = "";
            a.textContent = "⬇️ Download Video";
            linkBox.appendChild(a);

            // Play video preview
            videoPlayer.src = data.download_url;
            videoPlayer.load();
            videoPlayer.play();

            message.textContent = "✅ Video ready to preview & download!";
        } catch (err) {
            console.error(err);
            message.textContent = "⚠️ Failed to fetch video.";
        }
    });
});
