<template>
  <div class="relative overflow-hidden">
    <!-- スクロールコンテナ -->
    <div
      ref="scrollContainer"
      class="flex whitespace-nowrap scroll-smooth"
      :style="{ transform: `translateX(${positionX}px)` }"
    >
      <!-- 複製されたレシピを順番に表示 -->
      <div
        v-for="(recipe, index) in loopedRecipes"
        :key="index"
        class="inline-block w-1/3 flex-shrink-0 px-2"
      >
        <RecipeCard :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipeCard from "@/views/recipe/RecipeCard.vue";

export default {
  name: "RecipeHorizontalScroll",
  props: {
    recipes: {
      type: Array,
      required: true,
    },
    scrollSpeed: {
      type: Number,
      default: 1, // 自動スクロール速度（小さいほど遅い）
    },
  },
  data() {
    return {
      positionX: 0, // 現在のスクロール位置
      loopedRecipes: [], // ループ用に拡張されたレシピ配列
    };
  },
  watch: {
    recipes: {
      immediate: true, // 初回のレンダリング時も反応する
      handler(newRecipes) {
        if (newRecipes && newRecipes.length > 0) {
          this.loopedRecipes = [...newRecipes, ...newRecipes]; // 配列を拡張
          this.resetScroll(); // スクロール位置をリセット
        }
      },
    },
  },
  mounted() {
    // レシピ配列を2倍に拡張
    this.loopedRecipes = [...this.recipes, ...this.recipes];

    // 自動スクロール開始
    this.startScrolling();
  },
  methods: {
    startScrolling() {
      const container = this.$refs.scrollContainer;

      const scroll = () => {
        this.positionX -= this.scrollSpeed; // 左にスクロール
        const containerWidth = container.scrollWidth / 2;

        // コンテナ幅の半分以上スクロールしたらリセット
        if (Math.abs(this.positionX) >= containerWidth) {
          this.positionX = 0;
        }

        // 次のフレームでスクロールを更新
        requestAnimationFrame(scroll);
      };

      scroll();
    },
    resetScroll() {
      cancelAnimationFrame(this.animationFrame); // アニメーションを停止
      this.positionX = 0; // スクロール位置をリセット
      this.startScrolling(); // スクロールを再開
    },
  },
  components: {
    RecipeCard,
  },
};
</script>

<style scoped>
/* スクロールバーを非表示にする */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
