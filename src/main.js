import { createApp } from 'vue';
import App from './App.vue';
import router from './routers'; // ルーティング設定をインポート
import './assets/main.css'; // Tailwind CSSを読み込む

createApp(App).use(router).mount('#app');
