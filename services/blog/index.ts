import { UseQueryResult, useQuery, useMutation, useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import axios from "@/configs/axios/axios_config";
import { IListBlogs, IPostBlog, ISingleblog } from "./interface";

export const useGetBlogs = (titleQuery:string = "", tag:string="", pag:number=1): UseInfiniteQueryResult<any> => {
    return useInfiniteQuery<IListBlogs>(["get-blogs"], async ({pageParam=1}) => {
      
      const res = await axios.get(`/blog` ,{ params: { page:pageParam ?? pag , query: titleQuery, tag }});      
      if (res.status >= 200 && res.status < 300)  {
        return res.data;
      }else{
        throw new Error('Fail to get list blog')
      }
    },{
        getNextPageParam: ({nexPage}) => {
            return nexPage
        }
    });
};

export function useGetBlogById(id:string | null):UseQueryResult<ISingleblog> {
  return useQuery(['blog', id], async () => {
    const res = await axios.get(`/blog/${id}`);   

    if (res.status >= 200 && res.status < 300)  {
      return res.data;
    }else{
      throw new Error(`Fail to get blog: ${id}`)
    }
  },{
    enabled: id !== null
  });
}



export const useCreateBlog = () => {
  return useMutation(async (data: IPostBlog) => {
    const res = await axios.post(`/blog`, data);

    if (res.status >= 200 && res.status < 300) {
      return res.data 
    }
  });
};


export const useGetListUserBlog = (id:string) => {
  return useQuery(['myblog', id], async () => {
    const res = await axios.get(`/blog/user/${id}`);   

    if (res.status >= 200 && res.status < 300)  {
      return res.data;
    }else{
      throw new Error(`Fail to get blog: ${id}`)
    }
  });
}

export const useDeleteBlogByID = ()=> {
    return useMutation(async (id: string)  => {
      const res = await axios.delete(`/blog/${id}`);
      return res.data 
    });
};


interface IUpdateBlog{
  title:string;
  tage: string[];
  content:string;
}

export const useUpdateBlogByID = ()=> {
  return useMutation(async ( param:{id: string, data:IUpdateBlog})  => {
    const { id, data } = param
    const res = await axios.put(`/blog/${id}`,{ ...data});
    return res.data 
  });
};
