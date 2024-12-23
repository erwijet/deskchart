import { createFileRoute, redirect } from "@tanstack/react-router";
import { session } from "shared/session";
import { z } from "zod";

export const Route = createFileRoute("/callback")({
    preload: false,
    validateSearch: z.object({ token: z.string() }),
    loaderDeps: ({ search: { token } }) => ({ token }),
    loader: ({ deps: { token } }) => {
        session.setToken(token);
        throw redirect({ to: "/" });
    },
});
