

export function generateFullApiURL(path: string) {
    return `${process.env.API_BASE_URL}/${path}`;
}
