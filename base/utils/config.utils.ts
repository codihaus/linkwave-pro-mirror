export let logLevel = (level: number) => {
    switch (level) {
        case -999:
            return "silent"
        case 999:
            return "verbose"
        default:
            return "infor"
    }
}
