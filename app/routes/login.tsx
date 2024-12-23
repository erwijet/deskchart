import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "../router";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const [{ url }] = trpc.notary.getAuthUrl.useSuspenseQuery("google", {
        refetchInterval: 5 * 1000, // 5 seconds
    });

    function handleOAuthGoogle() {
        window.location.href = url;
    }

    return <button onClick={() => void handleOAuthGoogle()}>Continue with Google</button>;
}
