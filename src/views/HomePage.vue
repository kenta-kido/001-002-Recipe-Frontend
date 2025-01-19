<template>
  <div class="container mx-auto py-8 px-4">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Explore Delicious Recipes</h1>
    </div>

    <div class="mb-12 bg-red-50 shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Latest Recipes</h2>
      <div class="bg-gray-100 p-4 rounded-lg">
        <RecipeHorizontalScroll :recipes="recipesLatest" :scrollInterval="4000" :scrollAmount="400" />
      </div>
    </div>

    <!-- Auto-Scrolling Recipe List -->
    <div
      ref="scrollContainer"
      class="overflow-x-scroll whitespace-nowrap scroll-smooth relative"
    >
      <RecipeList :recipes="recipes" />
    </div>
  </div>
</template>

<script>
import RecipeList from "@/views/recipe/RecipeList.vue";
import RecipeHorizontalScroll from "@/views/recipe/RecipeHorizontalScroll.vue";
import api from "@/api/axios";

export default {
  name: "HomePage",
  data() {
    return {
      recipes: [],
      recipesLatest: [],
    };
  },
  async mounted() {
    try {
      const response = await api.get("/recipes");
      if (response.data && response.data.length > 0) {
        this.recipes = response.data;
      } else {
        console.warn("No recipes found.");
      }
      // 最新のレシピデータを取得
      const latestResponse = await api.get("/recipes/latest");
      if (latestResponse.data && latestResponse.data.length > 0) {
        this.recipesLatest = latestResponse.data;
      } else {
        console.warn("No latest recipes found.");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  },
  methods: {
    startAutoScroll() {
      const container = this.$refs.scrollContainer;
      let scrollAmount = 0;

      setInterval(() => {
        if (container) {
          scrollAmount += 300; // Scroll by 300px
          if (scrollAmount >= container.scrollWidth) {
            scrollAmount = 0; // Reset scroll position
          }
          container.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }
      }, 3000); // Scroll every 3 seconds
    },
  },
  components: {
    RecipeList,
    RecipeHorizontalScroll, 
  },
};
</script>

<style scoped>
/* Optional styles */
</style>
