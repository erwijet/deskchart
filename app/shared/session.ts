const key = "app.deskchart.notary.token";

export const session = {
    getToken: () => localStorage.getItem(key),
    setToken: (token: string) => localStorage.setItem(key, token),
    clear: () => localStorage.removeItem(key),
};
