<template>
  <router-link to="/" class="logo-link">
    <img src="../assets/logo3.png" alt="Logo" class="logo" />
    <div class="logo-text-container">
      <p class="logo-text">MOGUMOGU</p>
      <p class="logo-subtext">Japan auf deinem Tisch</p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "LogoComponent",
  props: {
    logoSrc: {
      type: String,
      default: "@/assets/logo2.png", // デフォルトのロゴ画像パス
    },
    altText: {
      type: String,
      default: "Logo", // デフォルトのaltテキスト
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'OunenMouhitsu';
  src: url('@/assets/fonts/Ounen-mouhitsu.otf') format('opentype');
}


.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none; /* リンクの下線を消す */
}

.logo {
  height: clamp(5rem, 5vw, 10rem);
  width: auto;
  margin-right: 10px; /* ロゴとテキストの間にスペースを追加 */
}

.logo-text-container {
  display: flex;
  flex-direction: column; /* テキストを縦に並べる */
}

.logo-text {
  font-family: 'OunenMouhitsu', sans-serif;
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  font-weight: normal;
  color: black; /* 必要に応じて色を設定 */
  margin: 0; /* 上下の余白をリセット */
}

.logo-subtext {
  font-family: 'OunenMouhitsu', sans-serif;
  font-size: clamp(0.75rem, 2vw, 1.5rem);
  font-weight: normal;
  color: gray; /* サブテキストの色を薄く */
  margin: 0; /* 上下の余白をリセット */
}
</style>
