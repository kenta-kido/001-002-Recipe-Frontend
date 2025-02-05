<template>
  <div class="barcode-scanner">
    <h1>Barcode-Scanner</h1>

    <!-- Display webcam stream -->
    <div id="scanner-container"></div>
    <button @click="startScanner" class="start-button">Scan starten</button>

    <!-- Display scanned barcode -->
    <p v-if="scannedBarcode">Barcode: {{ scannedBarcode }}</p>

    <!-- Display product information -->
    <div v-if="productInfo" class="product-info">
      <h2>{{ productInfo.product_name || "Unbekanntes Produkt" }}</h2>
      <img
        v-if="productInfo.image_url"
        :src="productInfo.image_url"
        alt="Produktbild"
        class="product-image"
      />
      <p>Barcode: {{ productInfo.code }}</p>
      <p>Marke: {{ productInfo.brands || "Unbekannt" }}</p>
      <p>Kategorie: {{ productInfo.categories || "Unbekannt" }}</p>
      <p>Zutaten: {{ productInfo.ingredients_text || "Unbekannt" }}</p>
    </div>
  </div>
</template>

<script>
import Quagga from "quagga";

export default {
  name: "BarcodescanTestPage",
  data() {
    return {
      scannedBarcode: null, // Scanned barcode
      productInfo: null, // Product information
    };
  },
  methods: {
    // Start scanner
    startScanner() {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: document.querySelector("#scanner-container"), // Where to display webcam stream
          },
          locator: {
            patchSize: "large",
            halfSample: true, // Process at half size for better performance
          },
          decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader", "ean_8_reader"], // Supported barcode formats
          },
        },
        (err) => {
          if (err) {
            console.error("QuaggaJS Initialization Error:", err);
            return;
          }
          Quagga.start();
        }
      );

      // Barcode detection event
      Quagga.onDetected(async (data) => {
        this.scannedBarcode = data.codeResult.code; // Retrieve barcode
        Quagga.stop(); // Stop scanner
        await this.fetchProductInfo(); // Fetch product information
      });
    },

    // Fetch product information
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
          this.productInfo = data.product; // Save product information
        } else {
          alert("Produkt nicht gefunden. Bitte versuchen Sie einen anderen Barcode.");
          this.productInfo = null; // Clear data on error
        }
      } catch (error) {
        console.error("API-Fehler:", error);
        alert("Fehler beim Abrufen der Daten.");
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
