<template>
  <div class="max-w-3xl mx-auto my-8 p-8 bg-gray-50 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-700 mb-6">Edit User</h2>
    <form @submit.prevent="updateUser" class="space-y-6">
      <div>
        <label for="email" class="block text-lg font-semibold text-gray-600 mb-2">Email</label>
        <input
          type="email"
          id="email"
          v-model="user.email"
          required
          class="block w-full px-4 py-3 ring-1 ring-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label for="extraInfoRaw" class="block text-lg font-semibold text-gray-600 mb-2">Extra Info</label>
        <input
          type="text"
          id="extraInfoRaw"
          v-model="user.extraInfoRaw"
          class="block w-full px-4 py-3 ring-1 ring-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div v-if="user.password">
        <label for="newPassword" class="block text-lg font-semibold text-gray-600 mb-2">New Password</label>
        <span id="newPassword" class="block px-4 py-2 bg-gray-100 ring-1 ring-gray-300 rounded-lg">{{ user.password }}</span>
      </div>
      <div>
        <label for="role" class="block text-lg font-semibold text-gray-600 mb-2">Role</label>
        <select
          id="role"
          v-model="user.role"
          required
          class="block w-full px-4 py-3 ring-1 ring-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
      </div>
      <div class="flex space-x-4">
        <button type="submit" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg">
          Save Changes
        </button>
        <button
          v-if="userId !== 1"
          type="button"
          @click="resetPassword"
          class="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg"
        >
          Reset Password
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios"; // ここでインポートします

export default {
  name: "DashBoardUserEdit",
    data() {
      return {
        user: {
          email: "",
          extraInfoRaw: "", // ユーザーが記入する情報
          extraInfo: "", // サーバーに送信する情報
          role: "",
          password: "", // 新しいパスワードを格納
        },
        originalPasswordInfo: "", // 元のパスワード情報を一時保存
      };
    },
  mounted() {
    this.userId = parseInt(this.$route.params.id, 10); // URLからユーザーIDを取得
    this.fetchUser();
  },
  methods: {
    // ユーザー情報の取得
    async fetchUser() {
      try {
        const userId = this.$route.params.id; // URLパラメータからユーザーIDを取得
        const response = await api.get(`/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const userData = response.data;
        this.user.email = userData.email;
        this.user.extraInfoRaw = userData.extraInfo.replace(/\[Init Pass: \w{10}\]\s*/, '').replace(/\[Reset Pass: \w{10}\]\s*/, '');
        this.user.role = userData.role;

        // ExtraInfo からパスワード情報を抽出し保存
        const initPassMatch = userData.extraInfo.match(/\[Init Pass: (\w{10})\]/);
        const resetPassMatch = userData.extraInfo.match(/\[Reset Pass: (\w{10})\]/);

        this.originalPasswordInfo = resetPassMatch ? resetPassMatch[0] : initPassMatch ? initPassMatch[0] : "";

        // パスワード表示用
        this.user.password = resetPassMatch ? resetPassMatch[1] : initPassMatch ? initPassMatch[1] : "";
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Failed to fetch user.");
      }
    },
    // ランダムな10文字のパスワードを生成する関数
    generatePassword() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    },
    // パスワードリセット
    resetPassword() {
      const newPassword = this.generatePassword();
      this.originalPasswordInfo = '';
      this.user.password = newPassword;
    },
    // ユーザー情報の更新
    async updateUser() {
      try {
        // axios.put で送信するデータを直接構築
        const userId = this.$route.params.id;
        const edittedExtraInfo = `${this.originalPasswordInfo ? this.originalPasswordInfo : `[Reset Pass: ${this.user.password}]`} ${this.user.extraInfoRaw ? this.user.extraInfoRaw : ''}`.trim();
        const response = await api.put(
          `/admin/users/${userId}`,
          {
            email: this.user.email,
            extraInfo: edittedExtraInfo, // 修正済みの extraInfo を送信
            role: this.user.role,
            password: this.user.password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        console.log("Update Response:", response.data); // デバッグ用
        this.$router.push("/dashboard"); // 成功時にダッシュボードへリダイレクト
      } catch (error) {
        console.error("Error updating user:", error.response?.data || error.message);

        if (error.response?.status === 403) {
          alert("You do not have permission to update this user.");
        } else if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          this.$router.push("/login");
        } else {
          alert("Failed to update user. Please check the console for more details.");
        }
      }
    },
  },
};
</script>

