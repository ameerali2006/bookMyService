export interface IIsVerified {
    execute(email:string):Promise<{_id:string|null,status:string|null}>
}