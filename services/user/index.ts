import axios from "@/configs/axios/axios_config";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { IUser } from "./interface";

export const useGetUserByID = (id:string):UseQueryResult<IUser>  => {
    return useQuery(['user', id], async () => {
      const res = await axios.get(`/user/${id}`);   
  
      if (res.status >= 200 && res.status < 300)  {
        return res.data;
      }else{
        throw new Error(`Fail to get blog: ${id}`)
      }
    });
}