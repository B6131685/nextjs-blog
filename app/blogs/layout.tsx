import Header from "@/components/header/Header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body>
      <div className="homeLayout">{children}</div>
    </body>
  );
}
