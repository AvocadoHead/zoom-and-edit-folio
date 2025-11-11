import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  /**
   * When running the development server locally you can enable edit mode by
   * setting the VITE_EDIT_MODE environment variable.  In production builds
   * this flag is false by default.  See src/components/portfolio/PortfolioCanvas.tsx
   * for how this value is used.
   */
  const editMode = process.env.VITE_EDIT_MODE === 'true';

  return {
    base: '/',
    server: {
      host: '::',
      port: 8080,
    },
    plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Expose a global constant for the edit mode flag.  The boolean value is
      // stringified here so that it becomes a literal true/false in the
      // generated bundle.  If VITE_EDIT_MODE is undefined, this will be false.
      __EDIT_MODE__: JSON.stringify(editMode),
    },
    build: {
      sourcemap: false,
    },
  };
});
