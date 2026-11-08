import { defineConfig } from "vite";

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 5173,

        allowedHosts: [
            "stability-unboxed-unplanted.ngrok-free.dev",
        ],

        proxy: {
            "/voice-sessions": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },

            "/candidates": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },

            "/tools": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },

            "/vapi": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },

            "/health": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },

            "/docs": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },

            "/openapi.json": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },
        },
    },
});