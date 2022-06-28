export const capitalize = (str:string | any) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
    // return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word:any, index:number)
    // {
    //     return index == 0 ? word.toLowerCase() : word.toUpperCase();
    // }).replace(/\s+/g, '');
}