import { cookies } from "next/headers";
import { MyError } from "../myerror";
import { CookieInterface } from './cookles.interface'

class ServerCookie implements CookieInterface {
    expires: number;
    constructor(expires: number = 1) {
        this.expires = expires
    }
    getCookie(key: string): string {
        let ck = cookies()
        let value = ck.get(key)?.value
        if(!value){
            throw MyError.MissingCookieKeyOrData
        }
        return value
    }
    setCookie(key: string, data: any, expires: number = this.expires) {
        let ck = cookies()
        ck.set(key, data, {
            maxAge: expires * 24 * 60 * 60 * 1000
        })
        return
    }
    deleteCookie(key: string) {
        let ck = cookies()
        ck.set(key, "", {
            maxAge: 0,
            expires: new Date(0)
        })
        return
    } 
}

export { ServerCookie }