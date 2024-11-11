"use client";

import {
  Center,
  Link as ChakraLink,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import supabase from "../../supabase/config";
import BaseBanner from "../base-banner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setLoggedIn(session?.user !== undefined && session?.user !== null);
    });
  }, []);

  return (
    <>
      {loggedIn ? (
        <>
          <BaseBanner>Hi</BaseBanner>
          {children}
        </>
      ) : (
        <Center
          flexGrow={1}
          bgGradient="to-tl"
          gradientFrom={{ base: "gray.50", _dark: "gray.700" }}
          gradientVia={{ base: "red.200", _dark: "red.700" }}
          gradientTo={{ base: "gray.50", _dark: "gray.700" }}
        >
          <HStack gap={8}>
            <Text textStyle="7xl" _dark={{ color: "white" }}>
              404
            </Text>
            <Separator
              orientation="vertical"
              height={28}
              size="md"
              borderRadius="full"
              borderColor={{ base: "black", _dark: "white" }}
            />
            <VStack align="flex-start">
              <Text p={2} textStyle="xl" _dark={{ color: "white" }}>
                An error occurred
              </Text>
              <ChakraLink
                asChild
                variant="underline"
                p={2}
                _dark={{ color: "white" }}
              >
                <NextLink href="/">Return to the homepage</NextLink>
              </ChakraLink>
            </VStack>
          </HStack>
        </Center>
      )}
    </>
  );
}
