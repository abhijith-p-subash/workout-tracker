export interface User{
    id?:string,
    uid?:string,
    name?:string,
    email?:string,
    age?:number,
    weight?:number,
}

export interface MyWorkOut{
    id?:string,
    uid?:string,
    bodyPart:string,
    wrkout:string,
    set:Set[],
    cretedAt?:string,
    updatedAt?:string,
}

interface Set{
    weight:number,
    rep:number
}