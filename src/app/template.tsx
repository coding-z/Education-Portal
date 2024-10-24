"use client";

import Register from "@/components/register";
import { Button } from "@/components/ui/button";
import { DialogOpenChangeDetails, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [registerOpen, setRegisterOpen] = useState(false);

  function handleOpenRegister() {
    setRegisterOpen(true);
  }

  function handleRegisterOpenChange(details: DialogOpenChangeDetails) {
    setRegisterOpen(details.open);
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
        <Button colorPalette="teal" onClick={handleOpenRegister}>
          Sign Up
        </Button>
      </Flex>
      <Register
        open={registerOpen}
        handleOpenChange={handleRegisterOpenChange}
      />
      {children}
    </>
  );
}
