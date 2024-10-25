"use client";

import Login from "@/components/login";
import Signup from "@/components/signup";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  DialogOpenChangeDetails,
  Flex,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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

  function handleCloseLogin() {
    setLoginOpen(false);
  }

  function handleLoginOpenChange(details: DialogOpenChangeDetails) {
    setLoginOpen(details.open);
  }

  return (
    <>
      <Flex
        justify="space-around"
        bgColor="gray.50"
        shadow="sm"
        minH={14}
        align="center"
        w="full"
      >
        <Heading color="teal.600">Education Portal</Heading>
        <HStack>
          <Button colorPalette="teal" onClick={handleOpenSignup}>
            Sign Up
          </Button>
          <Button
            color="teal.600"
            borderColor="teal.600"
            variant="outline"
            onClick={handleOpenLogin}
          >
            Sign In
          </Button>
        </HStack>
      </Flex>
      <Signup
        open={signupOpen}
        onOpenChange={handleSignupOpenChange}
        onCloseSignup={handleCloseSignup}
      />
      <Login
        open={loginOpen}
        onOpenChange={handleLoginOpenChange}
        onCloseLogin={handleCloseLogin}
      />
      {children}
      <Toaster />
    </>
  );
}
