import { ReactNode } from "react";

export function runCatching<T>(f: () => T): T | undefined {
    try {
        return f();
    } catch {
        return undefined;
    }
}

export function run<T>(f: () => T): T {
    return f();
}

export function createMarkerComponent() {
    return ({ children }: { children: ReactNode }) => children;
}
