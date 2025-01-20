<template>
  <div class="admin-page container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4 text-blue-500">Admin Recipe Management</h1>

    <!-- タブメニュー -->
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

    <!-- 動的に切り替わるコンポーネント -->
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
      tabs: ['tags', 'units', 'synonymstag','synonymsingredient'], // 新しいタブを追加
      tabLabels: {
        tags: 'Manage Tags',
        units: 'Manage Units',
        synonymstag: 'Manage Tag Synonyms', // タブ名を設定
        synonymsingredient: 'Manage Ingredient Synonyms'

      },
      currentSection: 'AdminRecipeTag', // 初期表示セクション
    };
  },
  methods: {
    showSection(tab) {
      if (tab === 'tags') {
        this.currentSection = 'AdminRecipeTag';
      } else if (tab === 'units') {
        this.currentSection = 'AdminRecipeUnit';
      } else if (tab === 'synonymstag') {
        this.currentSection = 'AdminRecipeSynonymTag'; // 新しいタブに対応するセクション
      } else if (tab === 'synonymsingredient') {
        this.currentSection = 'AdminRecipeSynonymIngredient'; // 新しいタブに対応するセクション
      }
    },
  },
};
</script>

<style scoped>
/* スタイルを調整して選択中のタブを強調 */
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
