<template>
  <div class="container mx-auto py-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Create New User</h2>
    <form @submit.prevent="createUser" class="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <div class="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <label for="email" class="block text-sm font-semibold text-gray-600 mb-2">Email</label>
        <input
          type="email"
          id="email"
          v-model="user.email"
          required
          class="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <label for="extraInfoRaw" class="block text-sm font-semibold text-gray-600 mb-2">Extra Info</label>
        <input
          type="text"
          id="extraInfoRaw"
          v-model="user.extraInfoRaw"
          class="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <label for="role" class="block text-sm font-semibold text-gray-600 mb-2">Role</label>
        <select
          id="role"
          v-model="user.role"
          required
          class="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
      >
        Done
      </button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "DashBoardUserCreate",
  data() {
    return {
      user: {
        email: "",
        extraInfoRaw: "",
        extraInfo: "",
        role: "ROLE_USER",
        password: "",
      },
    };
  },
  mounted() {
    this.generatePassword();
  },
  methods: {
    generatePassword() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.user.password = password;
      this.user.extraInfo = `[Init Pass: ${password}] ${this.user.extraInfoRaw}`;
    },
    async createUser() {
      this.user.extraInfo = `[Init Pass: ${this.user.password}] ${this.user.extraInfoRaw}`;

      try {
        await api.post("/admin/users", {
          email: this.user.email,
          extraInfo: this.user.extraInfo,
          role: this.user.role,
          password: this.user.password,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user.");
      }
    },
  },
};
</script>

<style scoped>
/* TailwindCSS styling used; no additional scoped styles needed */
</style>
