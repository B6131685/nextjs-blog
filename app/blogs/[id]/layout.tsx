"use client";
import { useRouter } from 'next/navigation'
export default function BlogIDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  return (
    <>
      {children}
    </>
  );
}
