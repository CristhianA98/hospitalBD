declare namespace Express {
    export interface Request {
        user: {
            userid: number,
            name: string,
            lastname: string,
            roleid: number
        }
    }
}