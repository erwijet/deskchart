import { useState } from "react";

export function usePromiseTracker<F extends (...args: any[]) => Promise<unknown>>(f: F) {
    const [isLoading, setIsLoading] = useState(false);
    function run(...args: unknown[]) {
        setIsLoading(true);
        return f(...args).then((ret) => {
            setIsLoading(false);
            return ret;
        });
    }

    return { run, isLoading } as { run: F; isLoading: boolean };
}
