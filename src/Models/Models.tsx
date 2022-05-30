export interface GeneralData{
    id?:string,
    uid?:string,
    name?:string,
    email?:string,
    age?:number,
    weight?:number,
    bodyPart?:string,
    wrkout?:string,
    set?:Set[],
    cretedAt?:string,
    updatedAt?:string,

}


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
    workout:string,
    set:Set[],
    date?:Date,
    createdAt?:string,
    updatedAt?:string,
}

interface Set{
    weight:number,
    rep:number
}

export interface Res{
    error?:boolean,
    data?:any
}