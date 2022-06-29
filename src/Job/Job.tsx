import { MyWorkOut } from "../Models/Models";
import moment from "moment";

export class Job {
    id?: string;
    email?: string;
    password?: string;
    collectionName?: string;
    orderBy?: string;
    sort?: string;
    limit?: number;
    payload?: any;

    // constructor(id?: string, email?: string, password?: string, collectionName?: string, orderBy?: string, sort?: string, limit?: number, payload?: any) {
    //     this.id = id;
    //     this.email = email;
    //     this.password = password;
    //     this.collectionName = collectionName;
    //     this.orderBy = orderBy;
    //     this.sort = sort;
    //     this.limit = limit;
    //     this.payload = payload;
    // }

}

export const chunks = (array: any[], size: number) => {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
}

export const compare = (a:MyWorkOut, b:MyWorkOut) => {
 
    
    
    if (moment(a.createdAt).format() > moment(b.createdAt).format()) {
        console.log("a is greater");
        
        return -1;
    }
    if (moment(a.createdAt).format() < moment(b.createdAt).format()) {
        console.log("b is greater");
        
        return 1;
    }
    return 0;
}