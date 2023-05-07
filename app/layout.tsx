import "./globals.css";
import AppProviders from "@/providers/index";
import "suneditor/dist/css/suneditor.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Suspense } from "react";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <Suspense fallback={"Loadding"}>
          <AppProviders>{children}</AppProviders>
        </Suspense>
      </body>
    </html>
  );
}
