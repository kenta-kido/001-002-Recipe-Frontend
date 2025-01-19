<template>
  <div class="tags-area bg-red-50 rounded-lg p-6 shadow-md">
    <!-- ドイツ語タイトル -->
    <h2 class="text-2xl font-semibold mb-6 text-gray-900 text-center">Beliebte Schlüsselwörter</h2>
    <div v-if="Object.keys(groupedTags).length === 0" class="text-gray-500 text-center">
      Keine Tags verfügbar.
    </div>
    <div v-else class="flex flex-wrap gap-6 justify-start">
      <!-- タグカテゴリーごとのセクション -->
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
      tags: [], // タグ一覧
      groupedTags: {}, // カテゴリーごとにグループ化されたタグ
    };
  },
  async mounted() {
    await this.fetchTags();
  },
  methods: {
    // タグ一覧を取得
    async fetchTags() {
      try {
        const response = await api.get("/tags");
        this.tags = response.data; // タグデータを取得
        this.groupTagsByCategory(); // カテゴリーごとにグループ化
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    },
    // タグをカテゴリーごとにグループ化
    groupTagsByCategory() {
      this.groupedTags = this.tags.reduce((groups, tag) => {
        const category = tag.category || "Unkategorisiert"; // ドイツ語: 未分類
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(tag);
        return groups;
      }, {});
    },
    // タグページにナビゲート
    navigateToTag(tagId) {
      this.$router.push({
        path: `/recipe/tags/${tagId}`, // TagIDを渡す
      });
    },
  },
};
</script>

<style scoped>
.category-card {
  max-width: 300px; /* カードの最大幅を制限 */
  text-align: center;
}

button {
  font-size: 1rem;
  font-weight: 500;
}
</style>
