import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            include: "**/*.jsx",
        }),
    ],
    envDir: "../",
    server: {
        watch: {
            usePolling: true,
        },
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        },
        hmr: {
            clientPort: 443,
        },
    },
    css: {
        lightningcss: {
            cssModules: {
                generateScopedName: "[local]_[hash:base64:5]",
            },
        },
    },
    build: {
        target: "esnext",
    },
});
