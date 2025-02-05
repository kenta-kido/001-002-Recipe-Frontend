<template>
  <div class="test">
    <h1>Test</h1>
    <h2>Mirin: 4904670123891</h2>
    <h2>Mirin (Deutschland): 6971835851454</h2>
    <h2>Miso (Deutschland): 4023900561965</h2>

    <!-- Barcode Input Section -->
    <div class="barcode-section">
      <input
        v-model="barcode"
        type="text"
        placeholder="Bitte geben Sie den Barcode ein"
        class="barcode-input"
      />
      <button @click="fetchProductInfo" class="fetch-button">Suche</button>
    </div>

    <!-- Display Product Information -->
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
export default {
  name: "BarcodeTestPage",
  data() {
    return {
      barcode: "", // Store user-entered barcode
      productInfo: null, // Product information retrieved from API
    };
  },
  methods: {
    async fetchProductInfo() {
      if (!this.barcode) {
        alert("Bitte geben Sie einen Barcode ein");
        return;
      }
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${this.barcode}.json`);
        const data = await response.json();
        if (data.status === 1) {
          this.productInfo = data.product; // Save product information
        } else {
          alert("Produkt nicht gefunden. Bitte versuchen Sie einen anderen Barcode.");
          this.productInfo = null; // Clear data in case of error
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
