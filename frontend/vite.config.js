// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://tfhub.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
