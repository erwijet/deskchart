import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
    preload: false,
    loader: () => {
        localStorage.removeItem("app.deskchart.notary.token");
        throw redirect({ to: "/login" });
    },
});
