import Cookies from 'js-cookie'
import { MyError } from "../myerror";
import { CookieInterface } from './cookles.interface'


class ClientCookie implements CookieInterface {
    expires: number;
    constructor(expires: number = 1) {
        this.expires = expires
    }
    getCookie(key: string): string {
        let value = Cookies.get(key)
        if(!value){
            return ""
        }
        return value
    }
    setCookie(key: string, data: any, expires: number = this.expires) {
        Cookies.set(key, data, { expires: expires })
        return
    }
    deleteCookie(key: string) {
        Cookies.remove(key)
        return
    }
}

export { ClientCookie }