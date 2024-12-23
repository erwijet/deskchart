/// <reference types="vinxi/types/client" />

import "@mantine/core/styles.css";

import { RouterProvider } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import React from "react";
import ReactDOM from "react-dom/client";

import { createRouter } from "../app/router";
import { useMediaQuery } from "@mantine/hooks";
import { theme } from "shared/theme";

// Set up a Router instance
const router = createRouter();

const App = () => {
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

    return (
        <MantineProvider theme={theme}>
            <ModalsProvider>
                <RouterProvider router={router} />
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
