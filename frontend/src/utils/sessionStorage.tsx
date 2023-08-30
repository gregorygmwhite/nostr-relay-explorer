function storeItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function clearItem(key: string) {
    sessionStorage.removeItem(key);
}

function getItem(key: string) {
    return sessionStorage.getItem(key);
}

export function updateUserInfo(user: any) {
    const currentUserInfo = getItem("user");
    clearItem("user");
    storeItem("user", user);
}

export function clearAllData() {
    sessionStorage.clear();
}
