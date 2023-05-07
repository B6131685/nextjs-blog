"use client";
import { usePathname } from "next/dist/client/components/navigation";
import React from "react";
import s from "./style.module.scss";
import { useGetListUserBlog } from "@/services/blog";
import Image from "next/image";
import { useGetUserByID } from "@/services/user";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import Card from "@/components/card/Card";

const User = () => {
  const path = usePathname();

  const { data: listBlog, isLoading: isListBlogLoading } = useGetListUserBlog(
    path?.split("/")[2] ?? undefined
  );

  const { data: user, isLoading: isUserLoading } = useGetUserByID(
    path?.split("/")[2] ?? ""
  );
  return (
    <div className={s.container}>
      <div className={s.Writer_info}>
        <div className="img">
          {isUserLoading ? (
            <Skeleton width={"100px"} height={"100px"} circle={true} />
          ) : user ? (
            <Image
              alt="menu.png"
              src={user?.image}
              width={100}
              height={100}
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <Image
              alt="menu.png"
              src={""}
              width={100}
              height={100}
              className={s.writer}
            />
          )}
        </div>
        <div className="info">
          {isUserLoading ? (
            <Skeleton width={"200px"} height={"50px"} />
          ) : (
            <h1>{user?.name}</h1>
          )}
        </div>
      </div>
      <div className={s.listBlogs}>
      {listBlog?.map((item:any) => {
                return (
                  <Link
                    key={item._id}
                    href={`/blogs/${item._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      key={item._id}
                      title={item.title}
                      writer={item.user.name}
                      tags={item.tags}
                    />
                  </Link>
                );
            })}
            {isListBlogLoading ? <Card.Loading /> : null}
      </div>
    </div>
  );
};

export default User;
