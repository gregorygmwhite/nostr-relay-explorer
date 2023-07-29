

export function generateFullApiURL(path: string) {
    return `${process.env.REACT_APP_API_BASE_URL}${path}`;
}
