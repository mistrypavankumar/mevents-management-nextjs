import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { connectToDatabase } from "@/lib/database";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MEvent",
  description: "MEvent is a platform for event management",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const data = async () => {
  //   await connectToDatabase();
  // };

  // data();

  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
