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
    bodyPartID?:string,
    bodyPart:string,
    workout:string,
    set:Set[],
    date?:string,
    time:string,
    createdAt:string,
    updatedAt?:string,
}

interface Set{
    weight:number,
    rep:number
}

export interface AllWorkOut{
    id:string,
    bodyPart:string,
    workouts:WorkOut[],
}

export interface WorkOut{
    url:string | undefined,
    name:string | undefined,
    description:string | undefined,
}
export interface Res{
    error?:boolean,
    data?:any
}

export interface Filter{
    field?:string | any,
    operator?:string | any,
    value?:any
}