class MyError extends Error{

    status: number;
    code: string;
    message: string;

    constructor(
        status: number,
        message: string,
        code: string
    ) {
        super(message)
        this.status = status
        this.code = code
        this.message = message

        Object.setPrototypeOf(this, new.target.prototype)
    }

    getHttpStatus(): number {
        return this.status
    }

    getStatus(): string{
        return this.code
    }

    getMessage(): string {
        return this.message
    }

    getError(): {code: string, error: string} {
        return { code: this.code, error: this.message }
    }

    static newError(status: number, code: string, message: string){
        return new MyError(status, message, code);
    }

    static InternalServerError(message: string){
        return new MyError(500, '10000', message)
    }

    public static FileNotFoundError = new MyError(404, '20000', 'Something is not found');
    public static InvalidCookieKeyOrData = new MyError(400, '20001', 'Invalid cookie key or data');
    public static MissingCookieKeyOrData = new MyError(400, '20002', 'Missing cookie key or data');
    public static MissingDataError = new MyError(500, '10001', 'Something is missing');
}


export { MyError }