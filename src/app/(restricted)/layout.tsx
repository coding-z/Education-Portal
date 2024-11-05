"use client";

import Error from "@/components/error";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Loading from "../loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [contents, setContents] = useState<React.JSX.Element>(<Loading />);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setContents(user ? <>{children}</> : <Error />);
    });
  }, []);

  return <>{contents}</>;
}
