"use client";

import Login from "@/components/login";
import Register from "@/components/register";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { DialogOpenChangeDetails, Flex, Heading, HStack } from "@chakra-ui/react";
import { useState } from "react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  function handleOpenRegister() {
    setRegisterOpen(true);
  }

  function handleCloseRegister() {
    setRegisterOpen(false);
  }

  function handleRegisterOpenChange(details: DialogOpenChangeDetails) {
    setRegisterOpen(details.open);
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
          <Button colorPalette="teal" onClick={handleOpenRegister}>
            Sign Up
          </Button>
          <Button color="teal.600" borderColor="teal.600" variant="outline" onClick={handleOpenLogin}>
            Sign In
          </Button>
        </HStack>
      </Flex>
      <Register
        open={registerOpen}
        handleOpenChange={handleRegisterOpenChange}
        handleCloseRegister={handleCloseRegister}
      />
      <Login
        open={loginOpen}
        handleOpenChange={handleLoginOpenChange}
        handleCloseLogin={handleCloseLogin}
      />
      {children}
      <Toaster />
    </>
  );
}
