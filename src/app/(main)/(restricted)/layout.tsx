"use client";

import Error from "@/components/error";
import React, { useEffect, useState } from "react";
import Loading from "../../loading";
import supabase from "../../../supabase/config";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [contents, setContents] = useState<React.JSX.Element>(<Loading />);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ error }) => {
        setContents(error ? <Error /> : <>{children}</>);
      });
  }, []);

  return <>{contents}</>;
}
