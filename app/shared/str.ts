import cuid from "cuid";

export function pluralize(n: number, label: string, morpheme: string = "s") {
    if (n == 1) return `${n} ${label}`;
    return `${n} ${label}${morpheme}`;
}

export function titlecase(s: string) {
    return s.at(0)?.toUpperCase() + s.slice(1).toLowerCase();
}

export function createCuid() {
    return cuid();
}
