
const encode = (data: any) : string => {
    let _data = data.toString()
    let encoded = btoa(_data)
    return encoded
}

const decode = (data: string) : string => {
    let decoded = atob(data)
    return decoded
}

export default { encode, decode }