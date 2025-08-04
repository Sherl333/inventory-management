import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // This path will be proxied
        target: 'http://localhost:8484', // Your backend's address
        changeOrigin: true, // Needed for virtual hosted sites
        // Optional: rewrite the path if your backend doesn't expect /api
        // rewrite: (path) => path.replace(/^\/api/, '') 
      },
    },
  },
});