export function pluralize(n: number, label: string, morpheme: string = "s") {
    if (n == 1) return `${n} ${label}`;
    return `${n} ${label}${morpheme}`;
}
