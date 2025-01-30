<template>
  <div class="admin-page container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4 text-blue-500">Admin Recipe Management</h1>

    <!-- Tab menu -->
    <div class="flex border-b mb-4">
      <div
        v-for="tab in tabs"
        :key="tab"
        :class="['px-4 py-2 cursor-pointer', currentSection === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500']"
        @click="showSection(tab)"
      >
        {{ tabLabels[tab] }}
      </div>
    </div>

    <!-- Dynamically switching components -->
    <component :is="currentSection" />
  </div>
</template>

<script>
import AdminRecipeTag from "@/views/admin/AdminRecipeTag.vue";
import AdminRecipeUnit from "@/views/admin/AdminRecipeUnit.vue";
import AdminRecipeSynonymTag from "@/views/admin/AdminRecipeSynonymTag.vue";
import AdminRecipeSynonymIngredient from "@/views/admin/AdminRecipeSynonymIngredient.vue";

export default {
  components: {
    AdminRecipeTag,
    AdminRecipeUnit,
    AdminRecipeSynonymTag,
    AdminRecipeSynonymIngredient,
  },
  data() {
    return {
      tabs: ['tags', 'units', 'synonymstag','synonymsingredient'], // Adding new tabs
      tabLabels: {
        tags: 'Manage Tags',
        units: 'Manage Units',
        synonymstag: 'Manage Tag Synonyms', // Set tab name
        synonymsingredient: 'Manage Ingredient Synonyms'

      },
      currentSection: 'AdminRecipeTag', // Initial display section
    };
  },
  methods: {
    showSection(tab) {
      if (tab === 'tags') {
        this.currentSection = 'AdminRecipeTag';
      } else if (tab === 'units') {
        this.currentSection = 'AdminRecipeUnit';
      } else if (tab === 'synonymstag') {
        this.currentSection = 'AdminRecipeSynonymTag'; // Section for the new tab
      } else if (tab === 'synonymsingredient') {
        this.currentSection = 'AdminRecipeSynonymIngredient'; // Section for the new tab
      }
    },
  },
};
</script>

<style scoped>
/* Adjust styles to highlight the selected tab */
.flex {
  display: flex;
}
.border-b {
  border-bottom: 1px solid #e2e8f0;
}
.cursor-pointer {
  cursor: pointer;
}
.text-gray-500 {
  color: #6b7280;
}
.text-blue-500 {
  color: #3b82f6;
}
.border-blue-500 {
  border-color: #3b82f6;
}
</style>
