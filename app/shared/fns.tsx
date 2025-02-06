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

export function runVoiding(f: () => unknown): () => void {
    return () => {
        f();
    };
}

export function createMarkerComponent() {
    return ({ children }: { children: ReactNode }) => children;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
type XArr<T> = {
    get: () => T[];
    concatIf: <E>(p: boolean | (() => boolean), o: E[]) => XArr<T | E>;
};
export function arr<T>(ker: T[]): XArr<T> {
    return {
        get: () => ker,
        concatIf<E>(p: boolean | (() => boolean), other: E[]) {
            if (typeof p == "function" ? p() : p) return arr([...ker, ...other]);
            else return this;
        },
    };
}
