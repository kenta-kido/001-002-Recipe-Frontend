import { createApp } from 'vue';
import App from './App.vue';
import router from './routers'; // Import routing configuration
import './assets/main.css'; // Load Tailwind CSS

createApp(App).use(router).mount('#app');
