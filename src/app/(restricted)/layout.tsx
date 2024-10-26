import Error from "@/components/error";
import { auth } from "@/firebase/config";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return auth.currentUser ? <>{children}</> : <Error />;
}
