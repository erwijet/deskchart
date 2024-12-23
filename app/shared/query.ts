import { QueryCache, QueryClient, queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { api } from "~router";
import { session } from "shared/session";

interface QueryCacheQuery {
    meta?: {
        errorMessage?: string;
        errorCallback?: () => void;
    };
}

export const qc = new QueryClient({
    // Default options are overridable on a per query/mutation basis
    defaultOptions: {
        queries: {
            retry: false,
            throwOnError: true,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
            throwOnError: true,
        },
    },
    queryCache: new QueryCache({
        onError: (error, query: QueryCacheQuery) => {
            query.meta?.errorCallback?.();
        },
    }),
});

export const queries = {
    session: () =>
        queryOptions({
            queryKey: ["session"],
            queryFn: async () => {
                const result = await api.notary.inspect.query(session.getToken() ?? "<NONE>");
                if (!result.valid) throw redirect({ to: "/logout" });

                const computed = {
                    initials: (result.claims.givenName.toUpperCase().at(0) ?? "") + result.claims.familyName.toUpperCase().at(0),
                };

                return { ...result.claims, ...computed };
            },
        }),
};
