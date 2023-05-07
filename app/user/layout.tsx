import Header from "@/components/header/Header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="homeLayout">
          <Header hiddenMenuSideNav={true}/>
          {children}
    </div>
  );
}
