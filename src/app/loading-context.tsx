import React, { createContext } from "react";

const LoadingContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(null);
export default LoadingContext;
