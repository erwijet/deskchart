import { Badge, Button, createTheme, Loader } from "@mantine/core";

export const theme = createTheme({
    primaryColor: "green",
    colors: {
        green: ["#ebf9f0", "#e0ede4", "#c3d6ca", "#a4bfad", "#8aac95", "#78a085", "#6e9a7d", "#5c866a", "#50775d", "#3f684e"],
    },
    components: {
        Badge: Badge.extend({
            defaultProps: {
                radius: "sm",
            },
        }),
        Button: Button.extend({
            defaultProps: {
                size: "compact-md",
            },
        }),
        Loader: Loader.extend({
            styles: {
                root: {
                    // forgive me lord for i have sinned
                    // transform: "translate(0px, calc((100vh / 2) - (100% / 2)))",
                },
            },
            defaultProps: {
                type: "bars",
                mx: "auto",
            },
        }),
    },
});
