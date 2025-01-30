<template>
  <header class="bg-white shadow-md fixed top-0 w-full z-50">
    <div class="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <LogoComponent />
      </div>

      <!-- User Info & Mobile Menu Button -->
      <div class="flex items-center space-x-4">
        <button
          v-if="!isLoggedIn"
          class="text-red-400 hover:text-red-500 font-semibold"
          @click="$router.push('/login')"
        >
          Login
        </button>
        <button
          v-else
          class="text-red-400 hover:text-red-500 font-semibold"
          @click="logout"
        >
          Logout
        </button>

        <!-- Search Bar -->
        <form
          class="flex-grow mx-4"
          @submit.prevent="searchRecipes"
        >
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="Search for recipes..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-300"
          />
        </form>

        <!-- Mobile Menu Button -->
        <button class="md:hidden" @click="toggleMenu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6 text-gray-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Desktop Dashboard -->
      <nav class="hidden md:flex items-center justify-center space-x-4 bg-red-400 px-4 py-2 shadow-sm">
        <router-link
          to="/"
          class="text-white hover:bg-red-500 px-3 py-2 rounded-md transition"
          @click="toggleMenu"
        >
          Home
        </router-link>
        <router-link
          to="/recipes/barcode"
          class="text-white hover:bg-red-500 px-3 py-2 rounded-md transition"
          @click="toggleMenu"
        >
          Barcode Scanner
        </router-link>
        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_USER'"
          to="/recipe"
          class="text-white hover:bg-red-500 px-3 py-2 rounded-md transition"
          @click="toggleMenu"
        >
          My Recipe
        </router-link>

        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_USER'"
          to="/user/account"
          class="text-white hover:bg-red-500 px-3 py-2 rounded-md transition"
          @click="toggleMenu"
        >
          My Account
        </router-link>

        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_ADMIN'"
          to="/dashboard"
          class="text-white hover:bg-red-500 px-3 py-2 rounded-md transition"
        >
          Dashboard
        </router-link>
        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_ADMIN'"
          to="/admin/recipe"
          class="text-white hover:bg-red-500 px-3 py-2 rounded-md transition"
        >
          Recipe
        </router-link>
      </nav>

    <!-- Mobile Navigation -->
    <transition name="slide-fade">
      <nav
        v-if="isMenuOpen"
        class="md:hidden bg-white shadow-md flex flex-col"
      >
        <router-link
          to="/"
          class="block bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition text-center"
          @click="toggleMenu"
        >
          Home
        </router-link>
        <router-link
          to="/recipes/barcode"
          class="block bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition text-center"
          @click="toggleMenu"
        >
          Barcode Scanner
        </router-link>      
        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_USER'"
          to="/recipe"
          class="block bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition text-center"
          @click="toggleMenu"
        >
          My Recipe
        </router-link>
        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_USER'"
          to="/user/account"
          class="block bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition text-center"
          @click="toggleMenu"
        >
          My Account
        </router-link>
        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_ADMIN'"
          to="/dashboard"
          class="block bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition text-center"
          @click="toggleMenu"
        >
          Dashboard
        </router-link>
        <router-link
          v-if="isLoggedIn && userRole === 'ROLE_ADMIN'"
          to="/admin/recipe"
          class="block bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition text-center"
          @click="toggleMenu"
        >
          Recipe
        </router-link>
        <!--
        <button
          v-if="!isLoggedIn"
          class="bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition"
          @click="goToLogin"
        >
          Login
        </button>
        <button
          v-else
          class="bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 transition"
          @click="logout"
        >
          Logout
        </button>
        -->
      </nav>
    </transition>
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
      isLoggedIn: false,  // Tracks the login state
      userEmail: "",  // Stores user email
      userRole: "",  // Stores user role (e.g., 'USER', 'ADMIN')
      isMenuOpen: false,  // Tracks whether the mobile menu is open
      searchKeyword: "",  // Stores the search keyword entered by the user
    };
  },
  mounted() {
    this.updateAuthStatus();  // Update authentication status when component is mounted
    window.addEventListener("authChanged", this.updateAuthStatus);  // Listen for authentication changes
  },
  beforeUnmount() {
    window.removeEventListener("authChanged", this.updateAuthStatus);  // Remove event listener before unmount
  },
  methods: {
    searchRecipes() {
      // Navigate to the search results page with the keyword
      if (this.searchKeyword.trim()) {
        this.$router.push({
          path: "/recipes/search",
          query: { keyword: this.searchKeyword.trim() },
        });
      }
    },
    logout() {
      // Log the user out by clearing localStorage and resetting state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      this.isLoggedIn = false;
      this.isMenuOpen = false;
      window.dispatchEvent(new Event("authChanged"));  // Dispatch event for auth change
      this.$router.push("/");  // Redirect to home
    },
    updateAuthStatus() {
      // Update login state based on localStorage
      this.isLoggedIn = !!localStorage.getItem("accessToken");
      this.userEmail = localStorage.getItem("userEmail") || "";
      this.userRole = localStorage.getItem("userRole") || "";
    },
    toggleMenu() {
      // Toggle the mobile menu state
      this.isMenuOpen = !this.isMenuOpen;
    },
    goToLogin() {
      // Navigate to the login page
      this.isMenuOpen = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Transitions for the slide-fade effect */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
