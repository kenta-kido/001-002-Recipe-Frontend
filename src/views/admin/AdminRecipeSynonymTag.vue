<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Tag Management</h1>

    <!-- タグとシノニム一覧 -->
    <div v-if="tags.length > 0">
      <div
        v-for="tag in tags"
        :key="tag.tagId"
        class="mb-8 p-4 bg-white shadow-md rounded-lg"
      >
        <!-- タグ名とカテゴリー -->
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-700">
            {{ tag.name }} ({{ tag.category }})
          </h2>
          <!-- Toggle Button -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            @click="toggleSynonyms(tag.tagId)"
          >
            {{ isSynonymsVisible(tag.tagId) ? "Hide Synonyms" : "Show Synonyms" }}
          </button>
        </div>

        <!-- シノニム一覧 -->
        <div v-if="isSynonymsVisible(tag.tagId)" class="mt-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Synonyms:</h3>
          <ul class="mb-4 space-y-2">
            <li
              v-for="synonym in tag.synonyms"
              :key="synonym.synonymId"
              class="flex items-center justify-between"
            >
              <span class="text-gray-800">{{ synonym.synonym }}</span>
              <button
                class="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                @click="deleteSynonym(synonym.synonymId, tag.tagId)"
              >
                Delete
              </button>
            </li>
          </ul>

          <!-- シノニム追加フォーム -->
          <div>
            <input
              type="text"
              v-model="newSynonyms[tag.tagId]"
              placeholder="Add new synonym"
              class="p-2 border border-gray-300 rounded-lg w-2/3"
            />
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-2"
              @click="addSynonym(tag.tagId)"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500">No tags available.</div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  data() {
    return {
      tags: [], // タグとシノニムのデータ
      newSynonyms: {}, // 新しいシノニムの入力
      visibleSynonyms: new Set(), // 開いているタグIDを管理
    };
  },
  async created() {
    await this.fetchTags();
  },
  methods: {
    // タグとシノニムのデータを取得
    async fetchTags() {
      try {
        const tagResponse = await api.get("/tags");
        const tags = tagResponse.data;

        for (const tag of tags) {
          const synonymResponse = await api.get(`/tags/${tag.tagId}/synonyms`);
          tag.synonyms = synonymResponse.data;
        }

        this.tags = tags;
      } catch (error) {
        console.error("Error fetching tags or synonyms:", error);
      }
    },
    // シノニムを追加
    async addSynonym(tagId) {
      if (!this.newSynonyms[tagId]) return;

      try {
        const synonymRequest = { synonym: this.newSynonyms[tagId] };
        const response = await api.post(`/tags/${tagId}/synonyms`, synonymRequest);
        const newSynonym = response.data;

        // シノニムをタグに追加
        const tag = this.tags.find((t) => t.tagId === tagId);
        if (tag) tag.synonyms.push(newSynonym);

        this.newSynonyms[tagId] = ""; // 入力欄をリセット
      } catch (error) {
        console.error("Error adding synonym:", error);
      }
    },
    // シノニムを削除
    async deleteSynonym(synonymId, tagId) {
      try {
        await api.delete(`/tags/synonyms/${synonymId}`);

        // シノニムを削除
        const tag = this.tags.find((t) => t.tagId === tagId);
        if (tag) {
          tag.synonyms = tag.synonyms.filter((s) => s.synonymId !== synonymId);
        }
      } catch (error) {
        console.error("Error deleting synonym:", error);
      }
    },
    // シノニムの表示切り替え
    toggleSynonyms(tagId) {
      if (this.visibleSynonyms.has(tagId)) {
        this.visibleSynonyms.delete(tagId);
      } else {
        this.visibleSynonyms.add(tagId);
      }
    },
    // シノニムが表示されているか確認
    isSynonymsVisible(tagId) {
      return this.visibleSynonyms.has(tagId);
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #f9fafa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}
</style>
