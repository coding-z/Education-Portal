"use client";

import Login from "@/components/login";
import Signup from "@/components/signup";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { toaster } from "@/components/ui/toaster";
import {
  Box,
  Center,
  Link as ChakraLink,
  DialogOpenChangeDetails,
  Flex,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../../supabase/config";
import NavigationDrawer from "@/components/navigation-drawer";
import NavigationHeader from "@/components/navigation-header";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ================================================================================
  // Signup, login and logout

  function handleOpenSignup() {
    setSignupOpen(true);
  }

  function handleCloseSignup() {
    setSignupOpen(false);
  }

  function handleSignupOpenChange(details: DialogOpenChangeDetails) {
    setSignupOpen(details.open);
  }

  function handleOpenLogin() {
    setLoginOpen(true);
  }

  function handleLoginSuccess() {
    setLoginOpen(false);
    router.push("/dashboard/units");
    console.log("routing");
  }

  function handleLoginOpenChange(details: DialogOpenChangeDetails) {
    setLoginOpen(details.open);
  }

  return (
    <Flex direction="column" justify="flex-start" align="center" h="full" w="full" flexGrow={1}>
      <NavigationHeader onOpenSignup={handleOpenSignup} onOpenLogin={handleOpenLogin} />
      <Flex direction="column" justify="center" align="center" flexGrow={1} w="full">
        {children}
      </Flex>
      <Signup
        open={signupOpen}
        onOpenChange={handleSignupOpenChange}
        onCloseSignup={handleCloseSignup}
      />
      <Login
        open={loginOpen}
        onOpenChange={handleLoginOpenChange}
        onLoginSuccess={handleLoginSuccess}
      />
    </Flex>
  );
}
