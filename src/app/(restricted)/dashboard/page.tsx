"use client";

import Units from "@/components/units";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import supabase from "../../../../supabase/config";

export default function Page(): React.JSX.Element {
  const [isTeacher, setIsTeacher] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        supabase
          .from("users")
          .select("privilege")
          .eq("email", user.email)
          .then((value) => {
            setIsTeacher(value.data[0].privilege === "teacher");
          });
      }
    });
  }, []);

  return (
    <>
      <h1>{isTeacher ? "Teacher" : "Student"}</h1>
      <Units />
    </>
  );
}
