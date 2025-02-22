/// <reference types="vinxi/types/client" />

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { theme } from "shared/theme";

import { createRouter } from "../app/router";
import { trpc, client } from "shared/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { qc } from "shared/query";

// Set up a Router instance
const router = createRouter();

const App = () => {
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

    return (
        <MantineProvider theme={theme} forceColorScheme={prefersDark ? "dark" : "light"}>
            <ModalsProvider modalProps={{ centered: true }}>
                <trpc.Provider client={client} queryClient={qc}>
                    <QueryClientProvider client={qc}>
                        <RouterProvider router={router} />
                    </QueryClientProvider>
                </trpc.Provider>

                <Notifications />
            </ModalsProvider>
        </MantineProvider>
    );
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
