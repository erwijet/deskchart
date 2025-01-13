import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { trpcQC } from "shared/trpc";

export interface RouterAppContext {
    trpcQC: typeof trpcQC;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
    component: RootComponent,
});

function RootComponent() {
    return <Outlet />;
}
