import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function MainLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
