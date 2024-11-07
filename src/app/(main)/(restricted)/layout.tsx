"use client";

import Error from "@/components/error";
import React, { useEffect, useState } from "react";
import supabase from "../../../supabase/config";
import Loading from "../../loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [contents, setContents] = useState<React.JSX.Element>(<Loading />);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setContents(session === null ? <Error /> : <>{children}</>);
    });
  }, []);

  return <>{contents}</>;
}
