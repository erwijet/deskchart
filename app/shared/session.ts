export const session = {
    getToken: () => localStorage.getItem("app.deskchart.notary.token"),
    setToken: (token: string) => localStorage.setItem("app.deskchart.notary.token", token),
    clear: () => localStorage.removeItem("app.deskchart.notary.token"),
};
