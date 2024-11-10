"use client";

import React, { useState } from "react";
import Loading from "./loading";
import LoadingContext from "./loading-context";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <LoadingContext.Provider value={setIsLoading}>
      {isLoading ? <Loading /> : children}
    </LoadingContext.Provider>
  );
}
