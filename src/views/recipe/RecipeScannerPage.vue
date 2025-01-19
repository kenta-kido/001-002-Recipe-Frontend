<template>
  <div class="barcode-scanner bg-gray-50 min-h-screen py-4 flex flex-col items-center">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Barcode Scanner</h1>

    <!-- Scanner Component -->
    <div class="relative w-11/12 sm:w-96 h-72 mx-auto">
      <div class="absolute left-1/2 top-0 transform -translate-x-1/2">
        <BarcodeScanner :key="scannerKey" @barcode-detected="handleBarcodeDetected" />
      </div>
    </div>

    <!-- Reload Button -->
    <button
      @click="reloadScanner"
      class="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200"
    >
      Retry Scanning
    </button>

    <!-- Scanned Barcode -->
    <p v-if="scannedBarcode" class="mt-4 text-center text-gray-700 font-medium">
      Barcode: <span class="font-bold">{{ scannedBarcode }}</span>
    </p>

    <!-- Product Information -->
    <div
      v-if="productInfo"
      class="product-info bg-white shadow-lg rounded-lg p-6 mt-6 max-w-lg w-full sm:w-96"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ productInfo.product_name || "Unknown Product" }}</h2>
      <img
        v-if="productInfo.image_url"
        :src="productInfo.image_url"
        alt="Product Image"
        class="w-full h-40 object-contain rounded-md mb-4"
      />
      <p class="text-gray-600"><span class="font-medium">Barcode:</span> {{ productInfo.code }}</p>
      <p class="text-gray-600"><span class="font-medium">Brand:</span> {{ productInfo.brands || "Unknown" }}</p>
      <p class="text-gray-600"><span class="font-medium">Category:</span> {{ productInfo.categories || "Unknown" }}</p>
      <p class="text-gray-600"><span class="font-medium">Ingredients:</span> {{ productInfo.ingredients_text || "Unknown" }}</p>
    </div>

    <!-- Recipe Search Section -->
    <div v-if="productInfo && productInfo.product_name"  class="mt-10 w-full px-4">
      <h2 class="text-2xl font-bold text-center mb-4">Search Results for "{{ productInfo.product_name }}"</h2>
      <RecipeSearch :keyword="productInfo.product_name" />
    </div>
  </div>
</template>

<script>
import BarcodeScanner from "@/components/BarcodeScanner.vue";
import RecipeSearch from "@/views/recipe/RecipeSearch.vue"; // Import RecipeSearch

export default {
  name: "RecipeScannerPage",
  components: {
    BarcodeScanner,
    RecipeSearch,
  },
  data() {
    return {
      scannerKey: 0, // Key to force re-rendering of BarcodeScanner component
      scannedBarcode: null,
      productInfo: null,
    };
  },
  methods: {
    // Handle detected barcode
    handleBarcodeDetected(barcode) {
      this.scannedBarcode = barcode;
      this.fetchProductInfo();
    },

    // Fetch product information from the API
    async fetchProductInfo() {
      if (!this.scannedBarcode) {
        alert("Please scan a barcode first.");
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
          alert("Product not found. Please try another barcode.");
          this.productInfo = null;
        }
      } catch (error) {
        console.error("API error:", error);
        alert("Failed to fetch product information. Please try again.");
      }
    },

    // Reload the scanner component
    reloadScanner() {
      this.scannerKey += 1; // Update the key to force re-rendering
      this.scannedBarcode = null; // Reset scanned barcode
      this.productInfo = null; // Reset product info
    },
  },
};
</script>
