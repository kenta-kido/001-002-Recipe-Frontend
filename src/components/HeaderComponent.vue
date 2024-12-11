<template>
  <header class="header">
    <router-link to="/" class="logo-link">
      <img src="/src/assets/logo.png" alt="Logo" class="logo" />
    </router-link>
    <nav>
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <a v-else @click="logout" style="cursor: pointer;">Logout</a>
      <!-- 管理者の場合にのみ表示されるリンク -->
      <router-link v-if="isLoggedIn && userRole === 'ROLE_ADMIN'" to="/dashboard" style="cursor: pointer;">Admin Dashboard</router-link>
    </nav>

    <!-- 右端にWelcome メッセージとユーザー情報を表示 -->
    <div v-if="isLoggedIn" class="user-info">
      <p>Welcome {{ userEmail }} ({{ userRole }})</p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      isLoggedIn: false,
      userEmail: '',  // ユーザーのメールアドレス
      userRole: ''    // ユーザーの役職
    };
  },
  mounted() {
    // マウント時にトークンをチェック
    this.isLoggedIn = !!localStorage.getItem('accessToken');

    // ユーザー情報をlocalStorageから取得
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userRole = localStorage.getItem('userRole') || '';

    // カスタムイベントのリスナーを追加
    window.addEventListener('authChanged', this.updateAuthStatus);
  },
  beforeUnmount() {
    // コンポーネントがアンマウントされる際にイベントリスナーを削除
    window.removeEventListener('authChanged', this.updateAuthStatus);
  },
  methods: {
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');  // メールアドレスもログアウト時に削除
      localStorage.removeItem('userRole');   // ロールもログアウト時に削除
      this.isLoggedIn = false;
      window.dispatchEvent(new Event('authChanged')); // ログアウト後にカスタムイベントを発火
      this.$router.push('/'); // ログアウト後にホームページにリダイレクト
    },
    updateAuthStatus() {
      this.isLoggedIn = !!localStorage.getItem('accessToken');
      // ログイン状態が変わったときに、メールアドレスとロールを更新
      this.userEmail = localStorage.getItem('userEmail') || '';
      this.userRole = localStorage.getItem('userRole') || '';
    }
  }
};
</script>

<style scoped>
:root {
  font-size: 16px; /* 基準フォントサイズ */
}

.header {
  padding: clamp(0.5rem, 2vw, 1.5rem); /* モバイルからデスクトップに対応したパディング */
  background-color: white; /* ヘッダーを白に変更 */
  color: black; /* テキストを黒に変更 */
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 下の境界に影を追加 */
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo {
  height: clamp(2rem, 5vw, 3rem); /* ロゴの高さをレスポンシブに調整 */
  width: auto;
}

nav {
  display: flex;
  gap: clamp(0.5rem, 1.5vw, 1rem); /* ナビゲーションリンク間の隙間を標準的なサイズに調整 */
}

a {
  color: black; /* リンクの色を黒に変更 */
  text-decoration: none;
  font-size: clamp(1rem, 1vw, 1.25rem); /* リンクのフォントサイズを標準化 */
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}

/* 右端にユーザー情報を表示 */
.user-info {
  text-align: right;
  font-size: clamp(0.875rem, 1vw, 1rem); /* ユーザー情報のフォントサイズを標準化 */
}
</style>
