import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  server: {
    port: 3000,
    fs: {},
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
    target: "es2022",
    minify: true,
    sourcemap: true,
  },
  optimizeDeps: {
    // exclude: ["@ethersproject/hash", "wrtc"],
    // include: ["js-sha3", "@ethersproject/bignumber"],
  },
});
