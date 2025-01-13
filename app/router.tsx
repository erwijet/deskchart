import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { trpcQC } from "shared/trpc";

import { routeTree } from "~routeTree.gen";

export function createRouter() {
    const router = createTanStackRouter({
        routeTree,
        defaultPreload: "intent",
        context: {
            trpcQC,
        },
        // Wrap: function WrapComponent({ children }) {
        //     return (
        //     );
        // },
    });

    return router;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}
