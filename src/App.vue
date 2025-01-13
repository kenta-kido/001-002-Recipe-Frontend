<template>
  <div id="app">
    <HeaderComponent ref="headerRef" />
    <main :style="{ marginTop: headerHeight + 'px' }">
      <router-view />
    </main>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";

export default {
  components: {
    HeaderComponent,
  },
  data() {
    return {
      headerHeight: 0, // ヘッダーの高さを保持
    };
  },
  mounted() {
    this.updateHeaderHeight(); // 初期設定
    window.addEventListener("resize", this.updateHeaderHeight); // ウィンドウリサイズ時に再計算
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateHeaderHeight); // イベントリスナーを削除
  },
  methods: {
    updateHeaderHeight() {
      // ヘッダーの高さを取得し、データに反映
      const headerElement = this.$refs.headerRef.$el;
      if (headerElement) {
        this.headerHeight = headerElement.offsetHeight;
      }
    },
  },
};
</script>