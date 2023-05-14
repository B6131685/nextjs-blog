"use client";
import { ReactNode } from "react";
import SideNavProvider from "./sideNav";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "./query";
import TanStackProvider from "./tanstackProvider";
type Props = {
  children: ReactNode;
};

const AppProviders = ({ children }: Props) => {
  return (
    <SessionProvider baseUrl="https://nextjs-blog-b6131685.vercel.app">
      <QueryProvider>
        <SideNavProvider>
          <TanStackProvider>{children}</TanStackProvider>
        </SideNavProvider>
      </QueryProvider>
    </SessionProvider>
  );
};

export default AppProviders;
