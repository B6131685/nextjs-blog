"use client";
import { useSideNav } from "@/providers/sideNav";
import { useQueryBlog } from "@/providers/query";
import s from "./page.module.scss";
import { useGetBlogs } from "@/services/blog/index";
import Card from "@/components/card/Card";
import { Datum } from "@/services/blog/interface";
import Link from "next/link";
import { getTags, useGetTags } from "@/services/tag";
import TagLabel from "@/components/tagLabel/tagLabel";
import { ITage } from "@/services/tag/interface";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [listTags, setListTags] = useState([])
  const sideNavState = useSideNav();
  const queryBlog = useQueryBlog();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useGetBlogs(queryBlog?.state?.title, queryBlog?.state?.tag);
  const queryClient = useQueryClient();
  // const { data: listTags = [] } = useGetTags();
  

  useEffect(()=>{
    getTags().then(
      (res)=>{
        setListTags(res)
      }
    )
    queryClient.refetchQueries({ queryKey: ["tags"] });
  },[])
  return (
    <>
      <Header/>
      <div className={s.container}>
        <div className={s.grid_layout}>
          <div
            className={`${s.sideNav} ${sideNavState.open ? s.open : ""}`}
            data-open={sideNavState.open ? "open" : "close"}
          >
            <div className={s.layoutTag}>
              {listTags.map((item: ITage) => {
                const selected = queryBlog?.state.tag === item._id;
                return (
                  <TagLabel
                    pointer={true}
                    active={selected}
                    label={item.tageLabel}
                    key={item._id}
                    onClick={() => {
                      if (queryBlog && queryBlog.dispatch) {
                        queryBlog?.dispatch({
                          type: selected ? "deleteTage" : "addTage",
                          payload: { tag: item._id },
                        });
                        // remove()
                        // refetch()
                        queryClient.removeQueries({ queryKey: ["get-blogs"] });
                        queryClient.refetchQueries({ queryKey: ["get-blogs"] });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className={s.listpost}>
            {data?.pages.map((item) => {
              return item?.data?.map((blog: Datum) => {
                return (
                  <Link
                    key={blog._id}
                    href={`/blogs/${blog._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      key={blog._id}
                      title={blog.title}
                      writer={blog.user.name}
                      tags={blog.tags}
                    />
                  </Link>
                );
              });
            })}
            {isLoading || isFetchingNextPage ? <Card.Loading /> : null}
            <br />
            {hasNextPage ? (
              <button
                className={s.loadmore}
                onClick={() => {
                  fetchNextPage();
                }}
              >
                <span style={{ fontSize: "2rem", cursor: "pointer" }}>
                  Load more
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
