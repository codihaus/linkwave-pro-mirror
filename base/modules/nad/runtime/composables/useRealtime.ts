import { createDirectus, staticToken, realtime } from "@directus/sdk";
import { withoutTrailingSlash } from "ufo";

export function useRealtime() {
    let apiURL = useCMSUrl()
    apiURL = withoutTrailingSlash(apiURL.replace('https', 'wss')) + '/websocket'

    const cookieKey = useState("cookieKey", () => "")
    const accessToken = useState("accessToken", () => "")
    const token = useCookie(cookieKey.value, {
            default: () => (""),
            watch: false
        }
    )

    console.log('token', accessToken.value)
    
    const client = createDirectus(apiURL)
        .with(staticToken(accessToken.value))
        .with(realtime());

    return client
}