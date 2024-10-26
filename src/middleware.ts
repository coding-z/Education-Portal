import { onAuthStateChanged } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./firebase/config";

export function middleware(request: NextRequest) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/error", request.url));
    }
  });
}

export const config = {
  matcher: "/dashboard",
};
