export type CorporateStops = {
    stopId:number,
    clientId:number,
    stopName:string,
    address:string,
    latitude:number,
    longitude:number,
    status:string,
    operatorNote:string,
    isActive:boolean,
    routeId:number,
    routeName:string

}

export type CorporateStopsUpdateDTO = {
    stopName?:string | null,
    address?:string | null,
    latitude?:number | null,
    longitude?:number | null,
    operatorNote?:string |null,
    isActive?:boolean | null,
    status?:string | null
}