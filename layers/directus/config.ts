import {withoutTrailingSlash} from "ufo";

export const HEADER_SDK_USER = 'authenticate-require'
export const HEADER_SDK_USER_VALUE = 'yes'

export const COOKIE_TOKEN = `${process.env.NUXT_COOKIE_PREFIX}_token`

export const BACKEND_URL = withoutTrailingSlash(process.env.NUXT_CMS_URL ?? '')

