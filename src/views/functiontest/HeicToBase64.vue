<template>
  <div class="test">
    <h1>HEIC Image Upload</h1>
    <div class="upload-section">
      <input type="file" @change="handleFileUpload" />
      <button @click="uploadImage" class="upload-button" :disabled="!selectedFile">Upload Image</button>
    </div>
    <div v-if="base64Image" class="base64-display">
      <h2>Base64 Encoded Result</h2>
      <textarea readonly class="base64-text" v-model="base64Image"></textarea>
    </div>
  </div>
</template>

<script>
import heic2any from "heic2any";

export default {
  name: "HeicToBase64",
  data() {
    return {
      selectedFile: null, // File to be uploaded
      base64Image: "", // Base64 encoded result from the API
    };
  },
  methods: {
    async handleFileUpload(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        let fileToUpload = files[0];

        // HEIC -> JPEG conversion
        if (fileToUpload.name.toLowerCase().endsWith(".heic")) {
        try {
            const convertedBlob = await heic2any({
            blob: fileToUpload,
            toType: "image/jpeg",
            });
            fileToUpload = new File([convertedBlob], "converted.jpg", {
            type: "image/jpeg",
            });
        } catch (error) {
            console.error("HEIC conversion error:", error);
            alert("Failed to convert HEIC.");
            return;
        }
        }

        // Send the file to the server
        this.uploadImage(fileToUpload);
    }
    },


    async uploadImage(file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8080/api/images/process", {
            method: "POST",
            body: formData,
            });

            if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
            }

            const base64Image = await response.text();
            this.base64Image = base64Image; // Save the result
        } catch (error) {
            console.error("Image upload error:", error);
            alert("Failed to upload the image.");
        }
    }
  },
};
</script>

<style scoped>
.upload-section {
  margin-bottom: 20px;
  text-align: center;
}

.upload-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #45a049;
}

.base64-display {
  margin-top: 20px;
  text-align: center;
}

.base64-text {
  width: 100%;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-family: monospace;
  overflow-y: auto;
}
</style>
