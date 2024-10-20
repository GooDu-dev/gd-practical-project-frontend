export interface CookieInterface {
    getCookie(key: string): string
    setCookie(key: string, data: any, expires: number): void
    deleteCookie(key: string): void
}
