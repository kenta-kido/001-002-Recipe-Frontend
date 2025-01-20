<template>
  <div class="barcode-scanner">
    <h1>バーコードスキャナー</h1>

    <!-- Webカメラ映像を表示 -->
    <div id="scanner-container"></div>
    <button @click="startScanner" class="start-button">スキャン開始</button>

    <!-- スキャンされたバーコードを表示 -->
    <p v-if="scannedBarcode">バーコード: {{ scannedBarcode }}</p>

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
import Quagga from "quagga";

export default {
  name: "BarcodescanTestPage",
  data() {
    return {
      scannedBarcode: null, // スキャンされたバーコード
      productInfo: null, // 製品情報
    };
  },
  methods: {
    // スキャナーを開始
    startScanner() {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: document.querySelector("#scanner-container"), // Webカメラ映像を表示する場所
          },
          locator: {
            patchSize: "large",
            halfSample: true, // パフォーマンス向上のため半分のサイズで処理
          },
          decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader", "ean_8_reader"], // 対応するバーコード形式
          },
        },
        (err) => {
          if (err) {
            console.error("QuaggaJS初期化エラー:", err);
            return;
          }
          Quagga.start();
        }
      );

      // バーコード検出イベント
      Quagga.onDetected(async (data) => {
        this.scannedBarcode = data.codeResult.code; // バーコードを取得
        Quagga.stop(); // スキャナー停止
        await this.fetchProductInfo(); // 製品情報を取得
      });
    },

    // 製品情報を取得
    async fetchProductInfo() {
      if (!this.scannedBarcode) {
        alert("バーコードをスキャンしてください");
        return;
      }
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${this.scannedBarcode}.json`
        );
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
#scanner-container {
  width: 100%;
  max-width: 500px;
  height: 300px;
  border: 1px solid #ccc;
  margin: 20px auto;
}

.start-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover {
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
