document.getElementById("applyCrops").addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) return alert("Please select an image first  :)");

    const file = fileInput.files[0];

    // crop dimentions (do not change.)
    const cropConfig = [
        { "startX": 0, "startY": 0.0, "cropWidth": 1.0, "cropHeight": 0.185, "maxWidth": 2000, "label": "Header" },
        { "startX": 0.05, "startY": 0.153, "cropWidth": 0.24, "cropHeight": 0.089, "maxWidth": 512, "label": "Flag" },
        { "startX": 0.435, "startY": 0.315, "cropWidth": 0.515, "cropHeight": 0.24, "maxWidth": 4196, "label": "Description" }
    ];

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const originalWidth = img.width;
            const originalHeight = img.height;

            // always clear the previous downloads
            const downloadContainer = document.getElementById("downloadContainer");
            downloadContainer.innerHTML = "";

            cropConfig.forEach((crop, index) => {
                const cropX = Math.round(crop.startX * originalWidth);
                const cropY = Math.round(crop.startY * originalHeight);
                const cropWidth = Math.round(crop.cropWidth * originalWidth);
                const cropHeight = Math.round(crop.cropHeight * originalHeight);

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = cropWidth;
                canvas.height = cropHeight;

                // draw cropped area
                ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

                // resize to upload limits max width 2000px (i dunno how to do max height 500px) while keeping aspect ratio
                const maxWidth = crop.maxWidth;
                if (cropWidth > maxWidth) {
                    const scale = maxWidth / cropWidth;
                    const newHeight = Math.round(cropHeight * scale);

                    const resizedCanvas = document.createElement("canvas");
                    resizedCanvas.width = maxWidth;
                    resizedCanvas.height = newHeight;
                    const resizedCtx = resizedCanvas.getContext("2d");
                    resizedCtx.drawImage(canvas, 0, 0, maxWidth, newHeight);

                    // replace canvas with resized one
                    canvas.width = maxWidth;
                    canvas.height = newHeight;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(resizedCanvas, 0, 0);
                }

                // create download button
                const downloadButton = document.createElement("button");
                downloadButton.textContent = `Download ${crop.label}`;
                downloadButton.onclick = function () {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL();
                    link.download = `${crop.label.toLowerCase()}.png`;
                    link.click();
                };

                // append download button to end of body
                const buttonContainer = document.createElement("div");
                buttonContainer.className = "button-container";
                buttonContainer.appendChild(downloadButton);

                downloadContainer.appendChild(buttonContainer);
            });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});