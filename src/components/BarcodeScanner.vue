<template>
  <div
    id="scanner-container"
    class="relative w-full h-full bg-gray-50 border-4 border-red-500 rounded-lg shadow-md overflow-hidden"
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
      isScanning: false,
    };
  },
  methods: {
    startScanner() {
      this.isScanning = true;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: document.querySelector("#scanner-container"),
            constraints: {
              width: 500,
              height: 300,
            },
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
            console.error("QuaggaJS initialization error:", err);
            this.isScanning = false;
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((data) => {
        const barcode = data.codeResult.code;
        this.$emit("barcode-detected", barcode);
        Quagga.stop();
        this.isScanning = false;
      });
    },
  },
  mounted() {
    this.startScanner();
  },
  beforeUnmount() {
    Quagga.stop();
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
