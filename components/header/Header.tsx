"use client";
import Link from "next/link";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import CButton from "../buttons/button";
import style from "./style.module.scss";
import Image from "next/image";
import Menu from "public/menu.png";
import { useSideNav, useSideNavDispatch } from "@/providers/sideNav";
import BlogLogo from "../BlogLogo";
import UserMenu from "../userMenu/UserMenu";
import Skeleton from "react-loading-skeleton";
import InputText from "../input/input";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useQueryBlog } from "@/providers/query";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  hiddenMenuSideNav?: boolean;
}
const Header = ({ hiddenMenuSideNav = false }: Props) => {
  const queryBlog = useQueryBlog();
  const pathname = usePathname();
  const router = useRouter();
  const sideNavState = useSideNav();
  const dispatch = useSideNavDispatch();
  const [search, setSearch] = useState<string>("");
  const { data: session, status } = useSession();

  const queryClient = useQueryClient();

  const socialAction = (action: string) => {
    console.log("socialAction");
    signIn(action, { redirect: false }).then((callback) => {
      if (callback?.error) {
        alert("Invalid credentials!");
      }

      if (callback?.ok) {
        router.push("/blogs");
      }
    });
  };

  function toggleSideNav() {
    sideNavState.open
      ? dispatch({ type: "close" })
      : dispatch({ type: "open" });
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (queryBlog!.dispatch) {
        queryBlog?.dispatch({ type: "setTitle", payload: { title: search } });
      }
      queryClient.removeQueries({ queryKey: ["get-blogs"] });
      queryClient.refetchQueries({ queryKey: ["get-blogs"] });
      if ([...(pathname?.split("/") ?? [])].pop() !== "blogs") {
        router.push("/blogs");
      }
    }
  };

  const handleTypeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className={style.containerQuery}>
      <div className={style.body}>
        <section className={style.left}>
          <Image
            hidden={true}
            width={100}
            height={100}
            className={`${style.menu} ${hiddenMenuSideNav ? style.hiddle : ""}`}
            src={Menu}
            alt="menu.png"
            onClick={() => {
              toggleSideNav();
            }}
          />
          <Link href="/blogs">
            <BlogLogo />
          </Link>
          <InputText
            placeholder="search"
            value={search}
            onChange={handleTypeSearch}
            onKeyDown={handleKeyDown}
          />
        </section>
        <section className={style.rigth}>
          {(() => {
            switch (status) {
              case "authenticated":
                return (
                  <>
                    <Link href="/new">
                      <CButton variant="blue">Create Blog</CButton>{" "}
                    </Link>
                    <div>
                      <UserMenu />
                    </div>
                  </>
                );
              case "unauthenticated":
                return (
                  <>
                    <CButton variant="blue" onClick={() => { signIn()} }>
                      Log in
                    </CButton>{" "}
                  </>
                );
              case "loading":
                return <Skeleton width={70} height="100%" />;
              default:
                return <></>;
            }
          })()}
        </section>
      </div>
    </div>
  );
};

export default Header;
