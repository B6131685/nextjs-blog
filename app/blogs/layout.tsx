
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="homeLayout">{children}</div>
    </>
  );
}
