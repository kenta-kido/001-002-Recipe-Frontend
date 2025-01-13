<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">My Recipe</h1>
    <router-link
      to="/recipe/create"
      class="bg-red-200 hover:bg-red-400 px-3 py-2 rounded-md transition"
    >
      Create Recipe
    </router-link>

    <!-- Recipe Table Section -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Your Recipes</h2>
      <div v-if="loading" class="text-gray-500">Loading...</div>
      <div v-else-if="recipes.length === 0" class="text-gray-500">
        You have no recipes yet. Create your first recipe!
      </div>
      <table v-else class="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-4 py-2">#</th>
            <th class="border border-gray-300 px-4 py-2">Title</th>
            <th class="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(recipe, index) in paginatedRecipes"
            :key="recipe.recipeId"
            class="hover:bg-gray-100 transition"
          >
            <td class="border border-gray-300 px-4 py-2">{{ index + 1 + (currentPage - 1) * pageSize }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ recipe.title }}</td>
            <td class="border border-gray-300 px-4 py-2 flex gap-2">
              <router-link
                :to="`/recipe/edit/${recipe.recipeId}`"
                class="bg-blue-200 hover:bg-blue-400 text-blue-800 px-3 py-1 rounded transition"
              >
                Edit
              </router-link>
              <button
                @click="deleteRecipe(recipe.recipeId)"
                class="bg-red-200 hover:bg-red-400 text-red-800 px-3 py-1 rounded transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-4">
        <button
          class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </button>
        <p class="text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </p>
        <button
          class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";

export default {
  name: "RecipeList",
  data() {
    return {
      recipes: [],
      loading: true,
      currentPage: 1,
      pageSize: 10, // 1ページあたりのアイテム数
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.recipes.length / this.pageSize);
    },
    paginatedRecipes() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.recipes.slice(start, end);
    },
  },
  methods: {
    async fetchRecipes() {
      try {
        const response = await api.get("/recipes/userrecipe", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.recipes = response.data;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        this.loading = false;
      }
    },
    async deleteRecipe(id) {
        console.log("Deleting recipe with ID:", id); // デバッグ用
        if (!id) {
            alert("Invalid recipe ID");
            return;
        }
      if (confirm("Are you sure you want to delete this recipe?")) {
        try {
          await api.delete(`/recipes/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          // レシピを削除後にリストを更新
          this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
          alert("Recipe deleted successfully.");
        } catch (error) {
          console.error("Error deleting recipe:", error);
          alert("Failed to delete the recipe. Please try again.");
        }
      }
    },
  },
  created() {
    this.fetchRecipes();
  },
};
</script>
