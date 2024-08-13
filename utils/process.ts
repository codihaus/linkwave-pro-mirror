export function percentage(loaded = 0, total = 1) {
    return Math.floor((loaded * 100) / total)
}