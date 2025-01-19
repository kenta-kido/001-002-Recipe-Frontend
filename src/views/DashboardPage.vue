<template>
  <div class="container mx-auto py-6">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">DashBoard</h1>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">User List</h2>
      <button @click="$router.push('/dashboard/user-create')" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Add New User
      </button>
    </div>

    <div class="overflow-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extra Info</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-100">
            <td class="px-6 py-4 text-sm text-gray-700">{{ user.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ user.email }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ user.role }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ user.extraInfo }}</td>
            <td class="px-6 py-4 text-sm">
              <button
                @click="editUser(user.id)"
                class="text-blue-600 hover:underline"
              >
                Edit
              </button>
            </td>
            <td class="px-6 py-4 text-sm">
              <button
                v-if="user.id !== 1"
                @click="deleteUser(user.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "DashBoard",
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await api.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    },
    editUser(userId) {
      this.$router.push(`/dashboard/user-edit/${userId}`);
    },
    async deleteUser(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await api.delete(`/admin/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          alert("User deleted successfully.");
          this.fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
        }
      }
    },
  },
};
</script>

<style scoped>
/* TailwindCSS is already included, no additional styles are needed here */
</style>
