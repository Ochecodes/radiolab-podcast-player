import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css' // Crucial for Tailwind injection

const app = createApp(App)

// Remove the global app.use() line to prevent the import error.
// We will rely on Flowbite-Vue components being imported ONLY in the component files (e.g., PodcastPlayer.vue)

app.mount('#app')
