<template>
  <div class="test">
    <h1>テスト</h1>
    <h2>みりん：4904670123891</h2>
    <h2>みりん（ドイツ）：6971835851454</h2>
    <h2>みそ（ドイツ）：4023900561965</h2>

    <!-- バーコード入力セクション -->
    <div class="barcode-section">
      <input
        v-model="barcode"
        type="text"
        placeholder="バーコードを入力してください"
        class="barcode-input"
      />
      <button @click="fetchProductInfo" class="fetch-button">検索</button>
    </div>

    <!-- 製品情報表示 -->
    <div v-if="productInfo" class="product-info">
      <h2>{{ productInfo.product_name || "製品名不明" }}</h2>
      <img
        v-if="productInfo.image_url"
        :src="productInfo.image_url"
        alt="製品画像"
        class="product-image"
      />
      <p>バーコード: {{ productInfo.code }}</p>
      <p>ブランド: {{ productInfo.brands || "不明" }}</p>
      <p>カテゴリ: {{ productInfo.categories || "不明" }}</p>
      <p>成分: {{ productInfo.ingredients_text || "不明" }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BarcodeTestPage",
  data() {
    return {
      barcode: "", // ユーザーが入力したバーコードを保存
      productInfo: null, // APIから取得した製品情報
    };
  },
  methods: {
    async fetchProductInfo() {
      if (!this.barcode) {
        alert("バーコードを入力してください");
        return;
      }
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${this.barcode}.json`);
        const data = await response.json();
        if (data.status === 1) {
          this.productInfo = data.product; // 製品情報を保存
        } else {
          alert("製品が見つかりませんでした。別のバーコードを試してください。");
          this.productInfo = null; // エラー時はデータをクリア
        }
      } catch (error) {
        console.error("APIエラー:", error);
        alert("データ取得に失敗しました。");
      }
    },
  },
};
</script>

<style scoped>
.barcode-section {
  margin-bottom: 20px;
  text-align: center;
}

.barcode-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 70%;
  max-width: 400px;
}

.fetch-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.fetch-button:hover {
  background-color: #45a049;
}

.product-info {
  margin-top: 20px;
  text-align: center;
}

.product-image {
  max-width: 200px;
  max-height: 200px;
  margin: 10px auto;
  border-radius: 10px;
  border: 1px solid #ccc;
}
</style>
