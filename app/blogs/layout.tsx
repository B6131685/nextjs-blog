// import TanStackProvider from "@/providers/tanstackProvider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <TanStackProvider>
    <>
      <div className="homeLayout">{children}</div>
    </>
    // </TanStackProvider>
  );
}
