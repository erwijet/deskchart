import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/deskplans")({
    component: RouteComponent,
});

function RouteComponent() {
    return "foo";
}
