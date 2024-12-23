import { createApp } from "vinxi";
import reactRefresh from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default createApp({
    server: {
        preset: "koyeb", // needed for docker support
        experimental: {
            asyncContext: true,
        },
        $env: {
            your: "mom",
        },
    },
    routers: [
        {
            type: "static",
            name: "public",
            dir: "./public",
        },
        {
            type: "http",
            name: "trpc",
            base: "/trpc",
            handler: "./server/trpc.handler.ts",
            target: "server",
            plugins: () => [reactRefresh(), tsConfigPaths()],
        },
        {
            type: "spa",
            name: "client",
            handler: "./index.html",
            target: "browser",
            plugins: () => [
                TanStackRouterVite({
                    routesDirectory: "./app/routes",
                    generatedRouteTree: "./app/routeTree.gen.ts",
                    autoCodeSplitting: true,
                }),
                reactRefresh(),
                tsConfigPaths(),
            ],
        },
    ],
});
