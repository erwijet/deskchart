import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
    preload: false,
    beforeLoad: () => {
        localStorage.removeItem("app.deskchart.notary.token");
        throw redirect({ to: "/login" });
    },
});
