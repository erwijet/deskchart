import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Box, Loader } from "@mantine/core";
import type { trpcQueryUtils } from "app/router";
import { Suspense } from "react";

export interface RouterAppContext {
    trpcQueryUtils: typeof trpcQueryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Suspense
                fallback={
                    <Box h="100%" w="100%">
                        <Loader />
                    </Box>
                }
            >
                <Outlet />
            </Suspense>
            <TanStackRouterDevtools position="bottom-left" />
            <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        </>
    );
}
