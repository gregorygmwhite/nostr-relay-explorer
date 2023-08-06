export function isValidPubKey(pubkey: string): boolean {
    const isAlphaNumeric = (str: string) => /^[a-z0-9]+$/i.test(str);
    return pubkey.length === 64 && isAlphaNumeric(pubkey);
}
