import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/home")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_auth/home"!</div>;
}