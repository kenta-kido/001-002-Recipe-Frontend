<template>
  <div class="test">
    <h1>Test</h1>

    <div v-for="(photo, index) in photos" :key="index" class="test-section">
      <p>Test {{ index + 1 }}:</p>
      
      <img
        :src="photo.binaryPhoto"
        alt="Testbild"
        class="test-icon"
        @click="showImage(photo.binaryPhoto)"
      />
      <p>Beschreibung ID: {{ photo.descriptionId }}</p>
    </div>

    <div v-show="isModalOpen" class="modal" @click="closeModal">
      <img :src="currentImage" alt="Vergrößertes Bild" class="modal-image" @click.stop />
    </div>
  </div>
</template>

<script>
import photoData from "@/assets/data/photo.json";

export default {
  name: "TestPage",
  data() {
    return {
      photos: photoData,
      isModalOpen: false,
      currentImage: "",
    };
  },
  methods: {
    showImage(imageUrl) {
      if (imageUrl) {
        this.currentImage = imageUrl;
        this.isModalOpen = true;
      }
    },
    closeModal() {
      if (this.isModalOpen) {
        this.isModalOpen = false;
        this.currentImage = "";
      }
    },
  },
};
</script>

<style scoped>
.test {
  text-align: center;
  margin-top: 50px;
}

.test-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.test-icon {
  width: 300px;
  height: 300px;
  object-fit: cover;
  cursor: pointer; /* Change cursor to indicate clickability */
  margin: 20px 0;
  border-radius: 20%;
  border: 2px solid #333;
}

/* Modal styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8); /* Dark background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it appears in front of other elements */
}

.modal-image {
  max-width: 90%; /* Adjust to fit within screen width */
  max-height: 90%; /* Adjust to fit within screen height */
  border: 2px solid white; /* White border around the image */
  border-radius: 10%; /* Round corners of the image */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.modal:hover {
  cursor: pointer; /* Indicate the background is clickable */
}
</style>
