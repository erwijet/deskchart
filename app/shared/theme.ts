import { createTheme, Loader } from "@mantine/core";

export const theme = createTheme({
    primaryColor: "green",
    colors: {
        green: ["#ebf9f0", "#e0ede4", "#c3d6ca", "#a4bfad", "#8aac95", "#78a085", "#6e9a7d", "#5c866a", "#50775d", "#3f684e"],
    },
    components: {
        Loader: Loader.extend({
            defaultProps: {
                type: "bars",
            },
        }),
    },
});
