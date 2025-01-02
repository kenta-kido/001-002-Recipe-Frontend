<template>
  <header class="header">
    <LogoComponent />
    <nav>
      <router-link v-if="isLoggedIn && userRole === 'ROLE_ADMIN'" to="/dashboard" style="cursor: pointer;">Dashboard</router-link>
    </nav>

    <div class="user-info">
      <button v-if="!isLoggedIn" class="login-button" @click="$router.push('/login')">Login</button>
      <button v-else class="logout-button" @click="logout">Logout</button>
    </div>
  </header>
</template>

<script>
import LogoComponent from "@/components/LogoComponent.vue";

export default {
  name: "HeaderComponent",
  components: {
    LogoComponent,
  },
  data() {
    return {
      isLoggedIn: false,
      userEmail: "",
      userRole: "",
    };
  },
  mounted() {
    this.isLoggedIn = !!localStorage.getItem("accessToken");
    this.userEmail = localStorage.getItem("userEmail") || "";
    this.userRole = localStorage.getItem("userRole") || "";
    window.addEventListener("authChanged", this.updateAuthStatus);
  },
  beforeUnmount() {
    window.removeEventListener("authChanged", this.updateAuthStatus);
  },
  methods: {
    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      this.isLoggedIn = false;
      window.dispatchEvent(new Event("authChanged"));
      this.$router.push("/");
    },
    updateAuthStatus() {
      this.isLoggedIn = !!localStorage.getItem("accessToken");
      this.userEmail = localStorage.getItem("userEmail") || "";
      this.userRole = localStorage.getItem("userRole") || "";
    },
  },
};
</script>

<style scoped>
:root {
  font-size: 18px; /* 全体的に文字を大きく設定 */
}

.header {
  padding: clamp(0.5rem, 2vw, 1.5rem);
  background-color: white;
  color: black;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

nav {
  margin-top: auto;
  display: flex;
  gap: clamp(0.5rem, 1.5vw, 1rem);
  align-items: center;
}

a {
  color: black;
  text-decoration: none;
  font-size: clamp(1.125rem, 1.2vw, 1.5rem); /* 少し大きめのフォントサイズ */
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}

/* ログインボタンのスタイル */
.login-button {
  background-color: #d63030;
  color: white; /* ボタン上の文字を白に設定 */
  border: none;
  padding: 0.75rem 1.25rem; /* ボタンサイズを大きく */
  font-size: clamp(1.125rem, 1.2vw, 1.5rem);
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #b52a2a;
}

.logout-button {
  background-color: #4caf50;
  color: white; /* ボタン上の文字を白に設定 */
  border: none;
  padding: 0.75rem 1.25rem; /* ボタンサイズを大きく */
  font-size: clamp(1.125rem, 1.2vw, 1.5rem);
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #45a049; 
}

/* 右端にユーザー情報を表示 */
.user-info {
  text-align: right;
  font-size: clamp(1rem, 1.1vw, 1.25rem); /* ユーザー情報も大きめに設定 */
}
</style>
