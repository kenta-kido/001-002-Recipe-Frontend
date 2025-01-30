<template>
  <div
    id="scanner-container"
    class="relative w-full h-full bg-gray-50 overflow-hidden"
  >
    <p v-if="!isScanning" class="absolute text-gray-500 text-center w-full">Camera Feed</p>
  </div>
</template>

<script>
import Quagga from "quagga";

export default {
  name: "BarcodeScanner",
  emits: ["barcode-detected"],
  data() {
    return {
      isScanning: false, // State variable to track whether scanning is active
    };
  },
  methods: {
    startScanner() {
      this.isScanning = true;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",  // Live stream from the camera
            target: document.querySelector("#scanner-container"),  // Target the container for the video feed
            constraints: {
              width: { ideal: 1280 },  // Ideal camera width
              height: { ideal: 720 },  // Ideal camera height
            },
          },
          locator: {
            patchSize: "large",  // Large patches for better detection
            halfSample: true, // Process at half size for better performance
          },
          decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader", "ean_8_reader"], // Integrated barcode readers
          },
        },
        (err) => {
          if (err) {
            console.error("QuaggaJS initialization error:", err);
            this.isScanning = false;  // Stop scanning on error
            return;
          }
          Quagga.start();  // Start the scanner
        }
      );

      Quagga.onDetected((data) => {
        const barcode = data.codeResult.code;  // Extract barcode data
        this.$emit("barcode-detected", barcode);  // Emit the detected barcode
        Quagga.stop();  // Stop scanning after a successful detection
        this.isScanning = false;  // Update scanning status
      });
    },
  },
  mounted() {
    this.startScanner();  // Start the scanner when the component is mounted
  },
  beforeUnmount() {
    Quagga.stop();  // Stop the scanner when the component is about to unmount
  },
};
</script>

<style scoped>
/* Style the scanner container */
#scanner-container {
  width: 100%;
  height: 300px; /* Set fixed height to match the video feed */
  position: relative;
}

#scanner-container video {
  object-fit: cover; /* Make the video fill the container */
  width: 100%;
  height: 100%;
}
</style>
