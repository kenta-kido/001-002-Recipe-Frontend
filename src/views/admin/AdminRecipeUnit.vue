<template>
  <div>
    <h2 class="text-xl font-bold text-gray-700 mb-2">Manage Units</h2>

    <!-- 表形式で単位を一覧表示 -->
    <table class="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Unit Name</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="unit in units"
          :key="unit.unitId"
          class="hover:bg-gray-50"
        >
          <td class="border border-gray-300 px-4 py-2">
            <template v-if="unit.isEditing">
              <input
                v-model="unit.tempName"
                class="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </template>
            <template v-else>
              {{ unit.unitName }}
            </template>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <template v-if="unit.isEditing">
              <button
                @click="saveUnit(unit)"
                class="text-green-500 hover:underline mr-2"
              >
                Save
              </button>
              <button
                @click="cancelEdit(unit)"
                class="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </template>
            <template v-else>
              <button
                @click="startEditing(unit)"
                class="text-blue-500 hover:underline mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteUnit(unit.unitId)"
                class="text-red-500 hover:underline"
              >
                Delete
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新しい単位を追加するフォーム -->
    <div class="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
      <h3 class="text-lg font-bold mb-2">Add New Unit</h3>

      <div class="mb-4">
        <label class="block text-gray-700">Unit Name</label>
        <input
          v-model="newUnitName"
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter unit name"
        />
      </div>

      <button
        @click="addUnit"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Add Unit
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "AdminRecipeUnit",
  data() {
    return {
      units: [],
      newUnitName: "",
    };
  },
  async mounted() {
    await this.loadUnits();
  },
  methods: {
    async loadUnits() {
      try {
        const response = await api.get("/units");
        this.units = response.data.map(unit => ({
          ...unit,
          isEditing: false,
          tempName: unit.unitName,
        }));
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    },
    startEditing(unit) {
      unit.isEditing = true;
    },
    cancelEdit(unit) {
      unit.tempName = unit.unitName;
      unit.isEditing = false;
    },
    async saveUnit(unit) {
      try {
        const response = await api.put(
          `/units/${unit.unitId}`,
          { unitName: unit.tempName },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );
        unit.unitName = response.data.unitName;
        unit.isEditing = false;
      } catch (error) {
        console.error("Failed to update unit:", error);
      }
    },
    async addUnit() {
      if (!this.newUnitName) {
        alert("Please provide a unit name.");
        return;
      }

      try {
        const response = await api.post(
          "/units",
          { unitName: this.newUnitName },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );
        this.units.push({
          ...response.data,
          isEditing: false,
          tempName: this.newUnitName,
        });
        this.newUnitName = "";
      } catch (error) {
        console.error("Failed to add unit:", error);
      }
    },
    async deleteUnit(unitId) {
      try {
        await api.delete(`/units/${unitId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        this.units = this.units.filter((unit) => unit.unitId !== unitId);
      } catch (error) {
        console.error("Failed to delete unit:", error);
      }
    },
  },
};
</script>

<style scoped>
table {
  table-layout: fixed; /* 幅を固定 */
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
