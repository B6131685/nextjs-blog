import axios from "@/configs/axios/axios_config";
import { UseQueryResult, useQuery, useMutation} from "@tanstack/react-query";
import { ITage } from "./interface";

export function useGetTags():UseQueryResult<ITage[]> {
    return useQuery(['tags'], async () => {
      const res = await axios.get(`/tag`);   
  
      if (res.status >= 200 && res.status < 300)  {
        return res.data;
      }else{
        throw new Error(`Fail to get list tags `)
      }
    },);
}

export async function getTags() {
    // const res = await axios.get(`/tag`);   
    let res = await fetch('http://localhost:3000/api/tag', { cache:'no-store' });
    if (res.status >= 200 && res.status < 300)  {
      return await res.json();;
    }else{
      throw new Error(`Fail to get list tags `)
    }
}