"use client";
import React, { useEffect } from "react";
import s from "./style.module.scss";
import Image from "next/image";
import IconUser from "public/icon-user.png";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import LinkCustom from "../LinkCustom";
// import { getCookie, hasCookie } from 'cookies-next';
// import { getCookies, setCookie, deleteCookie } from 'cookies-next';
import { getCookies } from "cookies-next";

import { useCookies } from "react-cookie";

interface Item extends React.ButtonHTMLAttributes<HTMLDivElement> {
  name: string;
}
const ItemMenu = ({ name, ...props }: Item) => {
  return (
    <div {...props} className={s.itemMenu}>
      {name}
    </div>
  );
};

const UserMenu = () => {
  const { data: session, status } = useSession();
  return (
    <div className={s.container}>
      <input
        className={s.checkbox}
        type="checkbox"
        id="vehicle1"
        name="vehicle1"
      />
      <label htmlFor="vehicle1">
        <Image
          style={{ borderRadius: "50%" }}
          width={30}
          height={30}
          src={session?.user?.image ?? IconUser}
          alt="icon-user.png"
        />
      </label>
      <div className={s.menu}>
        <LinkCustom href={`/user/${session?.user?.id}`}>
          <ItemMenu name="My Blogs" />
        </LinkCustom>
        {/* <ItemMenu onClick={() => console.log("Blogmarks")} name="Blogmarks" /> */}
        <ItemMenu onClick={() => signOut()} name="Sing Out" />
      </div>
    </div>
  );
};

export default UserMenu;
