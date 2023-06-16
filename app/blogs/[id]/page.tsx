"use client";
import React from "react";
import parse from "html-react-parser";
import s from "./page.module.scss";
import { useSession } from "next-auth/react";

import { useDeleteBlogByID, useGetBlogById } from "@/services/blog";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Tag } from "@/services/blog/interface";
import TagLabel from "@/components/tagLabel/tagLabel";
import LinkCustom from "@/components/LinkCustom";
import Header from "@/components/header/Header";
import { AxiosError } from "axios";
import Loading from "@/components/loading/Loading";
import Skeleton from "react-loading-skeleton";
import { useQueryClient } from "@tanstack/react-query";

const Blog = () => {
  const { mutate: deleteBlog, isLoading: isDeleting } = useDeleteBlogByID();
  const router = useRouter();
  const { status, data: dataSection } = useSession();
  const path = usePathname();
  const { data, isFetching } = useGetBlogById(path?.split("/")[2] ?? null);
  const queryClient = useQueryClient();
  const handleDeleteBlog = () => {
    if (path?.split("/")[2]) {
      deleteBlog(path?.split("/")[2], {
        onSuccess() {
          queryClient.removeQueries({ queryKey: ["get-blogs"] });
          router.push("/blogs");
        },
        onError(error, variables, context) {
          if (error instanceof AxiosError) {
            alert(error.response?.data.message);
          }
        },
      });
    } else {
      alert("can not delete");
    }
  };

  const handleEditBlog = ()=> {
    router.push(`/edit/${path?.split("/")[2]}` );
  }
  return (
    <>
      {!!isFetching || !!isDeleting ? <Loading /> : null}
      <Header hiddenMenuSideNav={true} />
      <div className={s.container}>
        <div className={s.content}>
          {isFetching ? (
            <div className={s.loading}>
              <Skeleton width="300px" height="60px" count={1} />
              <div className={s.loading_tage}>
                <Skeleton
                  width="70px"
                  height="20px"
                  count={1}
                  className={s.loading_tage_item}
                />
                <Skeleton
                  width="70px"
                  height="20px"
                  count={1}
                  className={s.loading_tage_item}
                />
              </div>
              <div className={s.info}>
                <Skeleton
                  width="40px"
                  height="40px"
                  circle={true}
                  count={1}
                />
                <div>
                  <Skeleton width="100px" height="20px" count={1} />
                  <Skeleton width="100px" height="20px" count={1} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={s.title}>
                <div className={s.Header}>
                  <h1>{data?.title}</h1>
                  <div className={s.control}>
                    {status === "authenticated" ? (
                      <>
                        <button onClick={handleDeleteBlog}>Delete</button>
                        <button  onClick={handleEditBlog}>Edit</button>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className={s.tageSection}>
                  {data?.tags?.map((item: Tag) => {
                    return <TagLabel label={item.tageLabel} key={item._id} />;
                  })}
                </div>
                <div className={s.info}>
                  <LinkCustom href={`./user/${data?.user._id}`}>
                    <Image
                      alt="menu.png"
                      src={data?.user?.image ?? ""}
                      width={30}
                      height={30}
                      className={s.writer}
                    />
                  </LinkCustom>
                  <div>
                    <div>Writer: {data?.user?.name}</div>
                    <div>
                      update:{" "}
                      {data && data.updateAt ? new Date(data?.updateAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      :
                      "XXXX"
                    }
                    </div>
                  </div>
                </div>
              </div>
              {parse(data?.content ? data.content : "")}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
