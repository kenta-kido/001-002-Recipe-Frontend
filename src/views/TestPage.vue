<template>
  <div class="test">
    <h1>テスト</h1>
    
    <div v-for="(photo, index) in photos" :key="index" class="test-section">
      <p>テスト {{ index + 1 }}:</p>
      
      <img
        :src="photo.binaryPhoto"
        alt="テスト画像"
        class="test-icon"
        @click="showImage(photo.binaryPhoto)"
      />
      <p>説明ID: {{ photo.descriptionId }}</p>
    </div>

    <div v-show="isModalOpen" class="modal" @click="closeModal">
      <img :src="currentImage" alt="拡大画像" class="modal-image" @click.stop />
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
  cursor: pointer; /* クリックできるようにカーソルを変更 */
  margin: 20px 0;
  border-radius: 20%;
  border: 2px solid #333;
}

/* モーダルのスタイル */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8); /* 背景の暗さ */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 他の要素より前面に表示 */
}

.modal-image {
  max-width: 90%; /* 画面の幅に収まるように調整 */
  max-height: 90%; /* 画面の高さに収まるように調整 */
  border: 2px solid white; /* 画像周囲の白い枠 */
  border-radius: 10%; /* 画像の角を丸くする */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.modal:hover {
  cursor: pointer; /* 背景をクリック可能なことを示すカーソル */
}
</style>
