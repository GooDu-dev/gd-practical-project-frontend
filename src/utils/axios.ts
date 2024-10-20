import axios, { AxiosResponse } from "axios";
import { MyError } from "./myerror";

class MyAxios {
    constructor(){ }
    get(url: string, params: {}) {
        const _url = process.env.NEXT_PUBLIC_API_URL + url
        return axios.get(_url, { params })
            .then(response => {
                if(response.data.code && response.data.error){
                    return MyError.newError(response.status, response.data.code, response.data.error)
                }
                else if(response.data.legth && response.data.length < 0) {
                    return MyError.MissingDataError
                }
                return response.data
            })
            .catch(error => {
                console.log(error)
                if(error instanceof Error) return MyError.InternalServerError(error.message)
                else return MyError.InternalServerError(String(error))
            })
    }
    post(url: string, data: {}): any {
        const _url = process.env.NEXT_PUBLIC_API_URL + url
        return axios.post(_url, data)
        .then(response => {
            if(response.data.code && response.data.error){
                return MyError.newError(response.status, response.data.code, response.data.error)
            }
            else if(response.data.legth && response.data.length < 0) {
                return MyError.MissingDataError
            }
            return response.data
        })
        .catch(error => {
            if(error instanceof Error) return MyError.InternalServerError(error.message)
            else return MyError.InternalServerError(String(error))
        })
    }
}

var _axios = new MyAxios();
export default _axios 