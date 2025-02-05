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
      headerHeight: 0, // Speichert die Höhe des Headers
    };
  },
  mounted() {
    this.updateHeaderHeight(); // Initiale Einstellung
    window.addEventListener("resize", this.updateHeaderHeight); // Neuberechnung bei Fenstergrößenänderung
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateHeaderHeight); // Entfernt den Event-Listener
  },
  methods: {
    updateHeaderHeight() {
      // Holt die Höhe des Headers und speichert sie in der Datenvariable
      const headerElement = this.$refs.headerRef.$el;
      if (headerElement) {
        this.headerHeight = headerElement.offsetHeight;
      }
    },
  },
};
</script>
