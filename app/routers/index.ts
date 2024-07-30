import auth from './auth.route'
import page from './page.route'

export default {
    page: [
        ...page,
        ...auth
    ],
}