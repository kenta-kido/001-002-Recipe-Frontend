<template>
  <div class="max-w-3xl mx-auto my-8 p-8 bg-gray-50 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-700 mb-6">Benutzer bearbeiten</h2>
    <form @submit.prevent="updateUser" class="space-y-6">
      <div>
        <label for="email" class="block text-lg font-semibold text-gray-600 mb-2">E-Mail</label>
        <input
          type="email"
          id="email"
          v-model="user.email"
          required
          class="block w-full px-4 py-3 ring-1 ring-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label for="extraInfoRaw" class="block text-lg font-semibold text-gray-600 mb-2">Zusätzliche Informationen</label>
        <input
          type="text"
          id="extraInfoRaw"
          v-model="user.extraInfoRaw"
          class="block w-full px-4 py-3 ring-1 ring-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div v-if="user.password">
        <label for="newPassword" class="block text-lg font-semibold text-gray-600 mb-2">Neues Passwort</label>
        <span id="newPassword" class="block px-4 py-2 bg-gray-100 ring-1 ring-gray-300 rounded-lg">{{ user.password }}</span>
      </div>
      <div>
        <label for="role" class="block text-lg font-semibold text-gray-600 mb-2">Rolle</label>
        <select
          id="role"
          v-model="user.role"
          required
          class="block w-full px-4 py-3 ring-1 ring-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="ROLE_USER">Benutzer</option>
          <option value="ROLE_ADMIN">Administrator</option>
        </select>
      </div>
      <div class="flex space-x-4">
        <button type="submit" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg">
          Änderungen speichern
        </button>
        <button
          v-if="userId !== 1"
          type="button"
          @click="resetPassword"
          class="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg"
        >
          Passwort zurücksetzen
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios"; // Import here

export default {
  name: "DashBoardUserEdit",
    data() {
      return {
        user: {
          email: "",
          extraInfoRaw: "", // User-entered information
          extraInfo: "", // Information sent to the server
          role: "",
          password: "", // Stores new password
        },
        originalPasswordInfo: "", // Temporarily store original password information
      };
    },
  mounted() {
    this.userId = parseInt(this.$route.params.id, 10); // Get user ID from URL
    this.fetchUser();
  },
  methods: {
    // Fetch user information
    async fetchUser() {
      try {
        const userId = this.$route.params.id; // Get user ID from URL parameters
        const response = await api.get(`/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const userData = response.data;
        this.user.email = userData.email;
        this.user.extraInfoRaw = userData.extraInfo.replace(/\[Init Pass: \w{10}\]\s*/, '').replace(/\[Reset Pass: \w{10}\]\s*/, '');
        this.user.role = userData.role;

        // Extract password information from ExtraInfo
        const initPassMatch = userData.extraInfo.match(/\[Init Pass: (\w{10})\]/);
        const resetPassMatch = userData.extraInfo.match(/\[Reset Pass: (\w{10})\]/);

        this.originalPasswordInfo = resetPassMatch ? resetPassMatch[0] : initPassMatch ? initPassMatch[0] : "";

        // Display password
        this.user.password = resetPassMatch ? resetPassMatch[1] : initPassMatch ? initPassMatch[1] : "";
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Benutzer konnte nicht geladen werden.");
      }
    },
    // Generate a random 10-character password
    generatePassword() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    },
    // Reset password
    resetPassword() {
      const newPassword = this.generatePassword();
      this.originalPasswordInfo = '';
      this.user.password = newPassword;
    },
    // Update user information
    async updateUser() {
      try {
        // Directly construct the data to be sent via axios.put
        const userId = this.$route.params.id;
        const edittedExtraInfo = `${this.originalPasswordInfo ? this.originalPasswordInfo : `[Reset Pass: ${this.user.password}]`} ${this.user.extraInfoRaw ? this.user.extraInfoRaw : ''}`.trim();
        const response = await api.put(
          `/admin/users/${userId}`,
          {
            email: this.user.email,
            extraInfo: edittedExtraInfo, // Send the modified extraInfo
            role: this.user.role,
            password: this.user.password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        console.log("Update Response:", response.data); // Debugging
        this.$router.push("/dashboard"); // Redirect to dashboard on success
      } catch (error) {
        console.error("Error updating user:", error.response?.data || error.message);

        if (error.response?.status === 403) {
          alert("Sie haben keine Berechtigung, diesen Benutzer zu aktualisieren.");
        } else if (error.response?.status === 401) {
          alert("Sitzung abgelaufen. Bitte erneut anmelden.");
          this.$router.push("/login");
        } else {
          alert("Fehler beim Aktualisieren des Benutzers. Weitere Details in der Konsole.");
        }
      }
    },
  },
};
</script>
