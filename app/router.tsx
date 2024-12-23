import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";

import { routeTree } from "../app/routeTree.gen";
import type { AppRouter } from "../server/trpc.handler";
import { Box, Center, Loader } from "@mantine/core";

export const queryClient = new QueryClient();

export const api = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/trpc",
        }),
    ],
});

export const trpc = createTRPCReact<AppRouter>({});

const client = trpc.createClient({
    links: [
        httpBatchLink({
            // since we are using Vinxi, the server is running on the same port,
            // this means in dev the url is `http://localhost:3000/trpc`
            // and since its from the same origin, we don't need to explicitly set the full URL
            url: "/trpc",
        }),
    ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
    queryClient,
    client: client,
});

export function createRouter() {
    const router = createTanStackRouter({
        routeTree,
        defaultPreload: "intent",
        context: {
            trpcQueryUtils,
        },
        defaultPendingComponent: () => (
            <Box h="100vh" w="100vw">
                <Center h="100%">
                    <Loader />
                </Center>
            </Box>
        ),
        Wrap: function WrapComponent({ children }) {
            return (
                <trpc.Provider client={client} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                </trpc.Provider>
            );
        },
    });

    return router;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}
