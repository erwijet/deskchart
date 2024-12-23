import { useEffect, useState } from "react";

export function usePathname() {
    const [pathname, setPathname] = useState(window.location.pathname);

    useEffect(() => {
        // Update pathname on URL changes
        const handleUrlChange = () => setPathname(window.location.pathname);
        window.addEventListener("popstate", handleUrlChange);

        return () => window.removeEventListener("popstate", handleUrlChange);
    }, []);

    return pathname;
}
