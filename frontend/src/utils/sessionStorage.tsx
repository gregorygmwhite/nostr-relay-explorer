const USER_DATA_KEY = "user";

function storeItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function clearItem(key: string) {
    sessionStorage.removeItem(key);
}

function getItem(key: string) {
    const rawData = sessionStorage.getItem(key);
    if (rawData) {
        return JSON.parse(rawData);
    } else {
        return null;
    }
}

export function updateUserInfo(user: any) {
    const currentUserInfo = getItem(USER_DATA_KEY);
    clearItem(USER_DATA_KEY);
    storeItem(USER_DATA_KEY, user);
}

export function getUserInfo() {
    const userInfo = getItem(USER_DATA_KEY);
    return userInfo;
}

export function clearAllData() {
    sessionStorage.clear();
}
