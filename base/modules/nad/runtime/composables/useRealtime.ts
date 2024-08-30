import { createDirectus, staticToken, realtime } from "@directus/sdk";
import { withoutTrailingSlash } from "ufo";

let client;

export function useRealtime() {
    let { getCMSUrl } = useCMSUrl()
    let apiURL = getCMSUrl()
    apiURL = withoutTrailingSlash(apiURL.replace('https', 'wss')) + '/websocket'

    const cookieKey = useState("cookieKey", () => "")
    const accessToken = useState("accessToken", () => "")
    const token = useCookie(cookieKey.value, {
            default: () => (""),
            watch: false
        }
    )
    
    if( ! client ) {
        client = createDirectus(apiURL)
            .with(staticToken(accessToken.value))
            .with(realtime());
    }

    return client
}