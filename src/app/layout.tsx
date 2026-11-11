import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammad Rayhan Arfadiansyah — Full Stack Developer",
  description: "Personal portfolio of Muhammad Rayhan Arfadiansyah, Full Stack Developer and Information Systems student."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
