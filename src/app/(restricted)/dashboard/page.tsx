"use client";

import Menu from "@/components/menu";
import Units from "@/components/units";
import { auth } from "@/firebase/config";
import { Flex, HStack, VStack } from "@chakra-ui/react";
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
    <HStack w="full" gap={0} flexGrow={1} align="stretch">
      <Flex direction="column" p={2} bgColor="gray.50" shadow="sm">
        <Menu />
      </Flex>
      <VStack w="full">
        <h1>{isTeacher ? "Teacher" : "Student"}</h1>
        <Units />
      </VStack>
    </HStack>
  );
}
