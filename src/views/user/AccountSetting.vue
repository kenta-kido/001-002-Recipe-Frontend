<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Account Settings</h1>
    <h2 class="text-lg text-gray-600 mb-6">
      Manage your email and password here.
    </h2>

    <!-- User Email Section -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Email</h3>
      <p v-if="userEmail" class="text-gray-800 mb-2">{{ userEmail }}</p>
      <p v-else class="text-gray-600 italic">Loading...</p>
      <button
        @click="openEmailChangeModal"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Change Email
      </button>
    </div>

    <!-- Password Change Section -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Password</h3>
      <button
        @click="openPasswordChangeModal"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Change Password
      </button>
    </div>

    <!-- Email Change Modal -->
    <div
      v-if="isEmailChangeModalOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-lg font-semibold mb-4">Change Email</h3>
        <form @submit.prevent="updateEmail">
          <input
            v-model="newEmail"
            type="email"
            placeholder="Enter new email"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeEmailChangeModal"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div
      v-if="isPasswordChangeModalOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-lg font-semibold mb-4">Change Password</h3>
        <form @submit.prevent="updatePassword">
          <input
            v-model="currentPassword"
            type="password"
            placeholder="Enter current password"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <input
            v-model="newPassword"
            type="password"
            placeholder="Enter new password"
            class="w-full p-2 border rounded mb-4"
            required
          />
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closePasswordChangeModal"
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

function decodeJWT(token) {
  if (!token) throw new Error("No token provided");

  const base64Url = token.split(".")[1]; // Extract Payload
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Base64URL -> Base64

  try {
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Failed to decode token");
  }
}

export default {
  name: "AccountSettings",
  data() {
    return {
      userEmail: "", // User's email
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      isEmailChangeModalOpen: false,
      isPasswordChangeModalOpen: false,
    };
  },
  mounted() {
    this.fetchUserEmail();
  },
  methods: {
    fetchUserEmail() {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded = decodeJWT(token);
          this.userEmail = decoded.e; // Assuming 'e' is the email claim
        } catch (error) {
          console.error("Error decoding JWT:", error);
        }
      }
    },
    openEmailChangeModal() {
      this.isEmailChangeModalOpen = true;
    },
    closeEmailChangeModal() {
      this.isEmailChangeModalOpen = false;
      this.newEmail = "";
    },
    async updateEmail() {
      if (!this.newEmail) {
        alert("Please enter a valid email address.");
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");

        // APIリクエスト
        const response = await api.put(
          "/users/me/email",
          { email: this.newEmail },
          {
            headers: {
              Authorization: `Bearer ${token}`, // トークンをヘッダーに設定
            },
          }
        );

        if (response.status === 200) {
          alert("Email updated successfully.");
          this.userEmail = this.newEmail; // 更新後のEmailを表示
            alert("Email updated successfully. Please log in again.");
            localStorage.removeItem("accessToken");
            this.$router.push("/login"); // ログインページにリダイレクト
          this.closeEmailChangeModal();
        } else {
          alert(`Error: ${response.data.message || "Unknown error occurred."}`);
        }
      } catch (error) {
        console.error("Failed to update email:", error);
        alert("An error occurred while updating the email.");
      }
    },
    openPasswordChangeModal() {
      this.isPasswordChangeModalOpen = true;
    },
    closePasswordChangeModal() {
      this.isPasswordChangeModalOpen = false;
      this.currentPassword = "";
      this.newPassword = "";
    },
    async updatePassword() {
      if (!this.currentPassword || !this.newPassword) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");

        // APIリクエスト
        const response = await api.put(
          "/users/me/password",
          {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // トークンをヘッダーに設定
            },
          }
        );

        if (response.status === 200) {
          alert("Password updated successfully.");
          this.closePasswordChangeModal();
        } else {
          alert(`Error: ${response.data.message || "Unknown error occurred."}`);
        }
      } catch (error) {
        console.error("Failed to update password:", error);
        alert("An error occurred while updating the password.");
      }
    },
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
