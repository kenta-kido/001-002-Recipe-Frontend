<template>
  <div class="tags-area bg-red-50 rounded-lg p-6 shadow-md">
    <!-- German Title -->
    <h2 class="text-2xl font-semibold mb-6 text-gray-900 text-center">Beliebte Schlüsselwörter</h2>
    <div v-if="Object.keys(groupedTags).length === 0" class="text-gray-500 text-center">
      Keine Tags verfügbar.
    </div>
    <div v-else class="flex flex-wrap gap-6 justify-start">
      <!-- Section for each tag category -->
      <div
        v-for="(tags, category) in groupedTags"
        :key="category"
        class="category-card bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-md flex-1 min-w-[250px]"
      >
        <h3 class="text-lg font-bold text-gray-700 mb-4 text-center">{{ category }}</h3>
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="tag in tags"
            :key="tag.tagId"
            @click="navigateToTag(tag.tagId)"
            class="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "TagArea",
  data() {
    return {
      tags: [], // List of tags
      groupedTags: {}, // Tags grouped by category
    };
  },
  async mounted() {
    await this.fetchTags();
  },
  methods: {
    // Fetch the list of tags
    async fetchTags() {
      try {
        const response = await api.get("/tags");
        this.tags = response.data; // Get the tags data
        this.groupTagsByCategory(); // Group tags by category
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    },
    // Group tags by their category
    groupTagsByCategory() {
      this.groupedTags = this.tags.reduce((groups, tag) => {
        const category = tag.category || "Uncategorized"; // Default to "Uncategorized" if no category is provided
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(tag);
        return groups;
      }, {});
    },
    // Navigate to the tag page
    navigateToTag(tagId) {
      this.$router.push({
        path: `/recipe/tags/${tagId}`, // Pass the tagId to the route
      });
    },
  },
};
</script>

<style scoped>
.category-card {
  max-width: 300px; /* Limit the maximum width of the card */
  text-align: center;
}

button {
  font-size: 1rem;
  font-weight: 500;
}
</style>
