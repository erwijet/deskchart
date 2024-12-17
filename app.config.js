import { createApp } from 'vinxi'
import reactRefresh from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default createApp({
  server: {
    preset: 'koyeb', // needed for docker support
    experimental: {
      asyncContext: true,
    },
  },
  routers: [
    {
      type: 'static',
      name: 'public',
      dir: './public',
    },
    {
      type: 'http',
      name: 'trpc',
      base: '/trpc',
      handler: './trpc-server.handler.ts',
      target: 'server',
      plugins: () => [reactRefresh()],
    },
    {
      type: 'spa',
      name: 'client',
      handler: './index.html',
      target: 'browser',
      plugins: () => [
        TanStackRouterVite({
          routesDirectory: './app/routes',
          generatedRouteTree: './app/routeTree.gen.ts',
          autoCodeSplitting: true,
        }),
        reactRefresh(),
      ],
    },
  ],
})
