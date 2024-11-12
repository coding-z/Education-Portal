"use client";

import {
  Center,
  Link as ChakraLink,
  HStack,
  Separator,
  Text,
  VStack,
  Heading
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import supabase from "../../supabase/config";
import BaseBanner from "../base-banner";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Avatar } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/app/icon.svg";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  function handleLogout() {
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        toaster.error({
          title: "Failed to Sign Out",
          duration: 5000,
        });
      } else {
        toaster.success({
          title: "Signed Out",
          duration: 5000,
        });
        router.push("/");
      }
    });
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <>
      {user !== null ? (
        <>
          <BaseBanner>
            <ChakraLink asChild color="teal.600" p={2}>
              <NextLink href="/">
                <HStack>
                  <Image src={logo} alt="Education portal logo" />
                  <Heading>Education Portal</Heading>
                </HStack>
              </NextLink>
            </ChakraLink>
            <HStack>
              <ChakraLink asChild color="teal.600" p={2}>
                <NextLink href="/dashboard/units">Units</NextLink>
              </ChakraLink>
              <ChakraLink asChild color="teal.600" p={2}>
                <NextLink href="/dashboard/codes">Codes</NextLink>
              </ChakraLink>
            </HStack>
            <MenuRoot>
              <MenuTrigger>
                <Avatar name={user.email} _hover={{ cursor: "pointer" }} />
              </MenuTrigger>
              <MenuContent>
                <MenuItem value={user.email} closeOnSelect={false}>
                  {user.email}
                </MenuItem>
                <MenuItem
                  value="logout"
                  onClick={handleLogout}
                  _hover={{ cursor: "pointer" }}
                >
                  Log Out
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </BaseBanner>
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
