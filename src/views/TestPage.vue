<template>
  <div class="test">
    <h1>テスト</h1>
    <!-- 画像アップロードセクション -->
    <div class="upload-section">
      <input type="file" @change="handleFileUpload" />
      <button @click="uploadImage" class="upload-button" :disabled="!selectedFile">画像アップロード</button>
    </div>

    <!-- Base64テキスト表示 -->
    <div v-if="base64Image" class="base64-display">
      <h2>Base64エンコード結果</h2>
      <textarea
        readonly
        class="base64-text"
        v-model="base64Image"
      ></textarea>
    </div>

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
      selectedFile: null, // アップロードするファイル
      base64Image: "", // APIからのBase64エンコード結果
    };
  },
  methods: {
    // 画像ファイル選択時の処理
    handleFileUpload(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.selectedFile = files[0];
      }
    },

    // 画像をAPIにアップロードしてBase64を取得
    async uploadImage() {
      if (!this.selectedFile) {
        alert("ファイルを選択してください");
        return;
      }
    // HEICファイルの判定と処理
      if (this.selectedFile.name.toLowerCase().endsWith(".heic")) {
        try {
          const formData = new FormData();
          formData.append("file", this.selectedFile);

          // 無料のHEIC変換APIを利用
          const heicResponse = await fetch("https://api.apyhub.com/convert/image/heic/jpeg-png/file", {
            method: "POST",
            body: formData,
          });

          if (!heicResponse.ok) {
            throw new Error(`HEIC変換エラー: ${heicResponse.status}`);
          }

          // HEICから変換されたJPEGファイルを取得
          const convertedBlob = await heicResponse.blob();
          this.selectedFile = new File([convertedBlob], "converted.jpg", {
            type: "image/jpeg",
          });
        } catch (error) {
          console.error("HEIC変換エラー:", error);
          alert("HEICファイルの変換に失敗しました。");
          return;
        }
      }


      try {
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        const response = await fetch("http://localhost:8080/api/images/process", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTPエラー: ${response.status}`);
        }

        const base64Text = await response.text();
        this.base64Image = base64Text; // 結果を保存
      } catch (error) {
        console.error("画像アップロードエラー:", error);
        alert("画像のアップロードに失敗しました。");
      }
    },
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
