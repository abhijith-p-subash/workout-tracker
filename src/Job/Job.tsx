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