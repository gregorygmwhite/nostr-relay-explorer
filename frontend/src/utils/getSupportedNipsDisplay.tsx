export default function getSupportedNipsDisplay(nips: number[]): string {
    if (nips && nips.length == 0) {
        return "None";
    } else {
        return nips.join(", ");
    }
}
