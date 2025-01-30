<template>
  <router-link to="/" class="logo-link">
    <img src="../assets/logo3.png" alt="Logo" class="logo" />
    <div class="logo-text-container">
      <p class="logo-text">MOGUMOGU</p>
      <p class="logo-subtext">Japan on your table</p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "LogoComponent",
  props: {
    logoSrc: {
      type: String,
      default: "@/assets/logo2.png", // Default logo image path
    },
    altText: {
      type: String,
      default: "Logo", // Default alt text
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'OunenMouhitsu';
  src: url('@/assets/fonts/Ounen-mouhitsu.otf') format('opentype');
}

/* Logo link style */
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none; /* Remove underline from the link */
}

/* Logo image styling */
.logo {
  height: clamp(5rem, 5vw, 10rem);
  width: auto;
  margin-right: 10px; /* Add space between logo and text */
}

/* Container for logo text (vertical arrangement) */
.logo-text-container {
  display: flex;
  flex-direction: column; /* Arrange text vertically */
}

/* Main logo text styling */
.logo-text {
  font-family: 'OunenMouhitsu', sans-serif;
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  font-weight: normal;
  color: black; /* Set color for main logo text */
  margin: 0; /* Remove vertical margin */
}

/* Subtext below the logo */
.logo-subtext {
  font-family: 'OunenMouhitsu', sans-serif;
  font-size: clamp(0.75rem, 2vw, 1.5rem);
  font-weight: normal;
  color: gray; /* Lighter color for subtext */
  margin: 0; /* Remove vertical margin */
}
</style>
