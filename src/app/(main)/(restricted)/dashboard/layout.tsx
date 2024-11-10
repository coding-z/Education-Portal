"use client";

import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import supabase from "../../../../supabase/config";
import DashboardHeader from "@/components/dashboard-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isTeacher, setIsTeacher] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        supabase
          .from("USER")
          .select("PRIVILEGE")
          .eq("EMAIL", session.user.email)
          .then((value) => {
            setIsTeacher(value.data[0].PRIVILEGE === "teacher");
          });
      }
    });
  }, []);

  return (
    <Flex direction="column" justify="flex-start" align="center" flexGrow={1} w="full">
      <DashboardHeader />
      {children}
    </Flex>
  );
}
