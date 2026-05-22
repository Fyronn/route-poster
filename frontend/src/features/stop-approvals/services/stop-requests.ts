import { deleteRequest, getRequest, putRequest } from "@/lib/api";
import { CorporateStops, CorporateStopsUpdateDTO } from "../types";

export async function getRequestedStops(clientId:number) {
    try{

        const stopReq = await getRequest<CorporateStops[]>(`/api/corporate-shuttle/clients/${clientId}/stops`)
        return stopReq || [];

    }catch(e){

        console.log(`Şirketin durakları çekilirken bir sorun oluştu`, e);
        return [];

    }
    
    
}

export async function updateCorporateStop(clientId:number,stopId:number,data:CorporateStopsUpdateDTO) {
    try{

        const updateStopReq = await putRequest<CorporateStops>(`/api/corporate-shuttle/clients/${clientId}/stops/${stopId}`,data)
        return updateStopReq;

    }catch(e){
        console.log(`Şirket durakları güncellenmeye çalışırken sorun oluştu`, e)
        throw e;
    }
    
}

export async function deleteCorporateStop(clientId:number,stopId:number) {
    try{
        const deleteReq = await deleteRequest<CorporateStops>(`/api/corporate-shuttle/clients/${clientId}/stops/${stopId}`)
        return deleteReq;

    }catch(e){
        console.log(`Şirket durakları silme işlemleri yapılmaya çalışırken bir sorun oluştu ${e}`)
        throw e;
    }
    
}