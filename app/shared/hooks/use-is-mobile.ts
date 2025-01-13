import { em, px, useMantineTheme } from "@mantine/core";
import React from "react";

export function useIsMobile() {
    const theme = useMantineTheme();
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: calc(${theme.breakpoints.sm} - ${em(1)}))`);
        const onChange = () => {
            setIsMobile(window.innerWidth < parseInt(px(theme.breakpoints.sm).toString()));
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < parseInt(px(theme.breakpoints.sm).toString()));
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return { isMobile: !!isMobile };
}
