"use client";
import { ReactNode } from "react";
import SideNavProvider from "./sideNav";
import UserContextProvider from "./UserContext";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import QueryProvider from "./query";
type Props = {
  children: ReactNode;
};
const queryClient = new QueryClient();
const Providers = ({ children }: Props) => {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <UserContextProvider>
            <QueryProvider>
              <SideNavProvider>{children}</SideNavProvider>
            </QueryProvider>
          </UserContextProvider>
        </SessionProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
};

export default Providers;
