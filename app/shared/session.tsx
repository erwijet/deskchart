import { useEffect } from "react";
import { logger } from "shared/logger";
import { trpc } from "shared/trpc";

const key = "app.deskchart.notary.token";

export const session = {
    getToken: () => localStorage.getItem(key),
    setToken: (token: string) => localStorage.setItem(key, token),
    clear: () => localStorage.removeItem(key),
};

export const SessionRenewer = () => {
    const { data } = trpc.session.renew.useQuery(void 0, {
        refetchInterval: 2 * 60 * 1000, // 2 minutes
    });

    useEffect(() => {
        if (!data?.ok) logger.error(data?.reason);
        else session.setToken(data.token);
    }, [data]);

    return null;
};
