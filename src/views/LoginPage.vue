<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-700 transition duration-300"
        >
          Login
        </button>
      </form>
      <div v-if="errorMessage" class="mt-4 text-red-500 text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

// JWTデコード関数
function decodeJWT(token) {
  const base64Url = token.split(".")[1]; // Payload部分
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default {
  data() {
    return {
      email: "",
      password: "",
      token: "",
      userRole: "", // ユーザーロール
      errorMessage: "",
    };
  },
  methods: {
    // ログインを試み、トークンを取得
    async handleLogin() {
      try {
        const response = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });

        this.token = response.data.accessToken;
        localStorage.setItem("accessToken", this.token); // トークンをlocalStorageに保存

        // JWTトークンをデコードしてメールアドレスとロールを取得
        const decoded = decodeJWT(this.token);
        const userEmail = decoded.e; // メールアドレス
        const userRole = decoded.a[0]; // ロール（配列の最初の要素）

        // メールアドレスとロールをlocalStorageに保存
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userRole", userRole);

        this.userRole = userRole; // ロールをセット

        window.dispatchEvent(new Event("authChanged")); // カスタムイベントを発火して、HeaderComponentに状態を伝える
        this.errorMessage = "";

        // ロールに基づいてリダイレクト先を変更
        if (userRole === "ROLE_ADMIN") {
          this.$router.push("/admin");
        } else {
          this.$router.push("/user");
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.errorMessage = "Invalid email or password.";
        this.token = "";
      }
    },
  },
  // コンポーネントがマウントされたときにlocalStorageからトークンを取得
  mounted() {
    const storedToken = localStorage.getItem("accessToken");
    const storedUserRole = localStorage.getItem("userRole");
    if (storedToken) {
      this.token = storedToken; // localStorageから取得したトークンをセット
      this.userRole = storedUserRole; // localStorageから取得したロールをセット
    }
  },
};
</script>

<style scoped>
/* 必要に応じて追加のスタイル */
</style>
