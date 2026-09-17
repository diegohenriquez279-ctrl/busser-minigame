import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: el build funciona servido desde cualquier ruta (útil para el acople futuro).
export default defineConfig({
  base: './',
  plugins: [react()],
});
