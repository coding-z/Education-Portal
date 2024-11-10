import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import "./global.css";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0D9488"
};

export const metadata: Metadata = {
  title: "Education Portal",
  description: "Learning management system web application"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  return (
    <html lang="en-GB" dir="ltr" suppressHydrationWarning>
      <body>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
