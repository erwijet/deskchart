import { QueryCache, QueryClient, queryOptions } from "@tanstack/react-query";
import { runCatching } from "shared/fns";
import { api } from "shared/trpc";

interface QueryCacheQuery {
    meta?: {
        errorMessage?: string;
        errorCallback?: () => void;
    };
}

export const qc = new QueryClient({
    // Default options are overridable on a per query/mutation basis
    defaultOptions: {},
    queryCache: new QueryCache({
        onError: (_error, query: QueryCacheQuery) => {
            query.meta?.errorCallback?.();
        },
    }),
});

export const queries = {
    session: () =>
        queryOptions({
            queryKey: ["session"],
            queryFn: async () => {
                const session = await runCatching(() => api.session.get.query());

                const computed = {
                    initials: (session?.user.givenName.toUpperCase().at(0) ?? "") + session?.user.familyName.toUpperCase().at(0),
                };

                return { ...session?.user, ...computed };
            },
        }),
};
