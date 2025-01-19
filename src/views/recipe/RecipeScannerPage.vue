<template>
  <div class="barcode-scanner bg-gray-50 min-h-screen py-4 flex flex-col items-center">
    <!-- 見出し -->
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Barcodescanner</h1>
    <p class="text-center text-gray-700 mb-1 max-w-lg">Haben Sie sich jemals gefragt, wie Sie asiatische Zutaten verwenden können, die Sie im Supermarkt finden?</p>
    <p class="text-center text-gray-700 mb-6 max-w-lg">Mit unserem Barcodescanner können Sie die Zutaten ganz einfach identifizieren und passende Rezepte entdecken!</p>

    <!-- スキャナーコンポーネント -->
    <div class="relative w-11/12 sm:w-96 h-72 mx-auto">
      <div class="absolute left-1/2 top-0 transform -translate-x-1/2">
        <BarcodeScanner :key="scannerKey" @barcode-detected="handleBarcodeDetected" />
      </div>
    </div>

    <!-- 再読み込みボタン -->
    <button
      @click="reloadScanner"
      class="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200"
    >
      Erneut Scannen
    </button>

    <!-- スキャンしたバーコード -->
    <p v-if="scannedBarcode" class="mt-4 text-center text-gray-700 font-medium">
      Barcode: <span class="font-bold">{{ scannedBarcode }}</span>
    </p>

    <!-- 商品情報 -->
    <!--
    <div
      v-if="productInfo"
      class="product-info bg-white shadow-lg rounded-lg p-6 mt-6 max-w-lg w-full sm:w-96"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ productInfo.product_name || "Unbekanntes Produkt" }}</h2>
      <img
        v-if="productInfo.image_url"
        :src="productInfo.image_url"
        alt="Produktbild"
        class="w-full h-40 object-contain rounded-md mb-4"
      />
      <p class="text-gray-600"><span class="font-medium">Barcode:</span> {{ productInfo.code }}</p>
      <p class="text-gray-600"><span class="font-medium">Marke:</span> {{ productInfo.brands || "Unbekannt" }}</p>
      <p class="text-gray-600"><span class="font-medium">Kategorie:</span> {{ productInfo.categories || "Unbekannt" }}</p>
      <p class="text-gray-600"><span class="font-medium">Zutaten:</span> {{ productInfo.ingredients_text || "Unbekannt" }}</p>
    </div>
    -->

    <!-- レシピ検索セクション -->
    <div v-if="productInfo && productInfo.product_name"  class="mt-10 w-full px-4">
      <h2 class="text-2xl font-bold text-center mb-4">Rezepte für "{{ productInfo.product_name }}"</h2>
      <RecipeSearch :keyword="productInfo.product_name" />
    </div>
  </div>
</template>

<script>
import BarcodeScanner from "@/components/BarcodeScanner.vue";
import RecipeSearch from "@/views/recipe/RecipeSearch.vue"; // RecipeSearchをインポート

export default {
  name: "RecipeScannerPage",
  components: {
    BarcodeScanner,
    RecipeSearch,
  },
  data() {
    return {
      scannerKey: 0, // Key to BarcodeScannerコンポーネントを強制的に再レンダリング
      scannedBarcode: null,
      productInfo: null,
    };
  },
  methods: {
    // 検出したバーコードを処理
    handleBarcodeDetected(barcode) {
      this.scannedBarcode = barcode;
      this.fetchProductInfo();
    },

    // APIから商品情報を取得
    async fetchProductInfo() {
      if (!this.scannedBarcode) {
        alert("Bitte scannen Sie zuerst einen Barcode.");
        return;
      }
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${this.scannedBarcode}.json`
        );
        const data = await response.json();
        if (data.status === 1) {
          this.productInfo = data.product;
        } else {
          alert("Produkt nicht gefunden. Bitte versuchen Sie einen anderen Barcode.");
          this.productInfo = null;
        }
      } catch (error) {
        console.error("API Fehler:", error);
        alert("Fehler beim Abrufen der Produktinformationen. Bitte versuchen Sie es erneut.");
      }
    },

    // スキャナーコンポーネントを再読み込み
    reloadScanner() {
      this.scannerKey += 1; // キーを更新して再レンダリングを強制
      this.scannedBarcode = null; // スキャンしたバーコードをリセット
      this.productInfo = null; // 商品情報をリセット
    },
  },
};
</script>
