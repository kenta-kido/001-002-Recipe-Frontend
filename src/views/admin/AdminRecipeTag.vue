<template>
  <div>
    <h2 class="text-xl font-bold text-gray-700 mb-2">Manage Tags</h2>

    <!-- List of tags displayed in a table format -->

    <!-- Display tags in a table -->
    <table class="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2 w-1/3">Name</th>
          <th class="border border-gray-300 px-4 py-2 w-1/3">Category</th>
          <th class="border border-gray-300 px-4 py-2 w-1/3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tag in tags"
          :key="tag.tagId"
          class="hover:bg-gray-50"
        >
          <td class="border border-gray-300 px-4 py-2">
            <template v-if="tag.isEditing">
              <input
                v-model="tag.tempName"
                class="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </template>
            <template v-else>
              {{ tag.name }}
            </template>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <template v-if="tag.isEditing">
              <input
                v-model="tag.tempCategory"
                class="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </template>
            <template v-else>
              {{ tag.category }}
            </template>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <template v-if="tag.isEditing">
              <button
                @click="saveTag(tag)"
                class="text-green-500 hover:underline mr-2"
              >
                Save
              </button>
              <button
                @click="cancelEdit(tag)"
                class="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </template>
            <template v-else>
              <button
                @click="startEditing(tag)"
                class="text-blue-500 hover:underline mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteTag(tag.tagId)"
                class="text-red-500 hover:underline"
              >
                Delete
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form to add a new tag -->
    <div class="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
      <h3 class="text-lg font-bold mb-2">Add New Tag</h3>

      <div class="mb-4">
        <label class="block text-gray-700">Tag Name</label>
        <input
          v-model="newTag.name"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter tag name"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Category</label>
        <select
          v-model="newTag.category"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option disabled value="">Select a category</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Or Add New Category</label>
        <input
          v-model="newCategory"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter new category (optional)"
        />
      </div>

      <button
        @click="addTag"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Add Tag
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "AdminRecipeTag",
  data() {
    return {
      tags: [],
      newTag: {
        name: "",
        category: "",
      },
      newCategory: "",
    };
  },
  computed: {
    // List of unique categories, removing duplicates
    uniqueCategories() {
      return [...new Set(this.tags.map((tag) => tag.category))];
    },
  },
  async mounted() {
    await this.loadTags();
  },
  methods: {
    async loadTags() {
      try {
        const response = await api.get("/tags");
        this.tags = response.data.map(tag => ({
          ...tag,
          isEditing: false,
          tempName: tag.name,
          tempCategory: tag.category,
        }));
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    },
    startEditing(tag) {
      tag.isEditing = true;
    },
    cancelEdit(tag) {
      tag.tempName = tag.name;
      tag.tempCategory = tag.category;
      tag.isEditing = false;
    },
    async saveTag(tag) {
      try {
        const response = await api.put(
          `/tags/${tag.tagId}`,
          { name: tag.tempName, category: tag.tempCategory },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );
        tag.name = response.data.name;
        tag.category = response.data.category;
        tag.isEditing = false;
      } catch (error) {
        console.error("Failed to update tag:", error);
      }
    },
    async addTag() {
      if (!this.newTag.name || (!this.newTag.category && !this.newCategory)) {
        alert("Please provide a name and a category.");
        return;
      }

      // Use the new category if provided
      const categoryToUse = this.newCategory || this.newTag.category;

      try {
        const response = await api.post(
          "/tags",
          { name: this.newTag.name, category: categoryToUse },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );

        // Add the new tag to the list
        this.tags.push({
          ...response.data,
          isEditing: false,
          tempName: this.newTag.name,
          tempCategory: categoryToUse,
        });

        // Reset the input fields
        this.newTag = { name: "", category: "" };
        this.newCategory = "";
      } catch (error) {
        console.error("Failed to add tag:", error);
      }
    },
    async deleteTag(tagId) {
      try {
        await api.delete(`/tags/${tagId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        this.tags = this.tags.filter((tag) => tag.tagId !== tagId);
      } catch (error) {
        console.error("Failed to delete tag:", error);
      }
    },
  },
};
</script>

<style scoped>
table {
  table-layout: fixed; /* Fixed width */
  width: 100%;
}
th, td {
  text-align: left;
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f8f8f8;
}
</style>
