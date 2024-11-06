import { Flex, Heading, HStack } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NavigationDrawer from "@/components/navigation-drawer";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "../../supabase/config";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../app/icon.svg";

export default function NavigationHeader({ onOpenSignup, onOpenLogin }: { onOpenSignup: () => void; onOpenLogin: () => void; }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  function handleLogout() {
    const signoutPromise = supabase.auth.signOut();

    signoutPromise.then(() => router.push("/"));

    toaster.promise(signoutPromise, {
      success: {
        title: "Signed Out",
        description: "Successfully signed out",
        duration: 5000,
      },
      error: {
        title: "Signout Error",
        description: "Failed to sign out",
        duration: 5000,
      },
      loading: {
        title: "Signing Out...",
        description: "Please wait",
      },
    });
  }

  useEffect(() => {
    supabase.auth.getUser()
    .then(({ data: { user }, error }) => {
      if (error) {
        setUser(null);
      } else {
        setUser(user);
      }
    });
  }, []);

  return (
    <Flex
      justify="center"
      bgColor="gray.50"
      shadow="md"
      minH={16}
      align="center"
      w="full"
      zIndex="docked"
    >
      <Flex
        flexGrow={1}
        justify="space-between"
        align="center"
        px={{ base: 2, md: 8, lg: 14 }}
        py={2}
      >
        <ChakraLink asChild colorPalette="teal" p={2}>
          <NextLink href="/">
            <Image src={logo} alt="Education portal logo" />
            <Heading color="teal.600">Education Portal</Heading>
          </NextLink>
        </ChakraLink>
        {user ? (
          <HStack>
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
          </HStack>
        ) : (
          <>
            <HStack hideBelow="md">
              <Button colorPalette="teal" onClick={onOpenSignup}>
                Sign Up
              </Button>
              <Button
                color="teal.600"
                borderColor="teal.600"
                variant="ghost"
                onClick={onOpenLogin}
              >
                Log In
              </Button>
            </HStack>
            <HStack hideFrom="md">
              <NavigationDrawer onOpenSignup={onOpenSignup} onOpenLogin={onOpenLogin} />
            </HStack>
          </>
        )}
      </Flex>
    </Flex>
  );
}
