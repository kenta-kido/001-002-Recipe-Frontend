<template>
  <div>
    <h2>Ich bin Admin</h2>

    <!-- Display the userRole on the screen -->
    <p>User Role: {{ userRole }}</p>

    <div v-if="isAdmin">
      <!-- Admin-only content goes here -->
      <p>Willkommen im Admin-Dashboard!</p>
    </div>
    <div v-else>
      <h2>Zugriff verweigert</h2>
      <p>Sie haben keine Berechtigung, diese Seite anzuzeigen.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false, // Assuming the user is not an admin by default
      userRole: '',   // Store the userRole in data
    };
  },
  mounted() {
    // Fetch userRole from localStorage when the component is mounted
    const role = localStorage.getItem('userRole');
    this.userRole = role; // Store the fetched userRole in data

    // Only show content if the user is an admin
    if (role === 'ROLE_ADMIN') {
      this.isAdmin = true;
    }
  }
};
</script>

<style scoped>
/* Add styles if needed */
</style>
