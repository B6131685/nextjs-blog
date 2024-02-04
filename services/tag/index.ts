import axios from "@/configs/axios/axios_config";
import { UseQueryResult, useQuery, useMutation} from "@tanstack/react-query";
import { ITage } from "./interface";

export function useGetTags():UseQueryResult<ITage[]> {
    return useQuery(['tags'], async () => {
      const res = await axios.get(`/tag`,{ headers: {
        "cache": 'no-store',
        "Access-Control-Allow-Credentials":"true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":  "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      }});   
  
      if (res.status >= 200 && res.status < 300)  {
        return res.data;
      }else{
        throw new Error(`Fail to get list tags `)
      }
    },);
}
