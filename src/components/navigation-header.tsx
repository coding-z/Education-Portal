import NavigationDrawer from "@/components/navigation-drawer";
import { Avatar } from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { toaster } from "@/components/ui/toaster";
import { Link as ChakraLink, Flex, Heading, HStack } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../app/icon.svg";
import supabase from "../supabase/config";
import Login from "./login";
import { Tables } from "@/supabase/supabase";

export default function NavigationHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Tables<"USER"> | null>(null);
  const router = useRouter();

  function handleLogout() {
    supabase.auth.signOut().then(({ error }) => {
      if (error === null) {
        router.push("/");
        toaster.success({
          title: "Signed Out",
          duration: 5000,
        });
      } else {
        toaster.error({
          title: "Failed to Sign Out",
          duration: 5000,
        });
      }
    });
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session !== null ? session.user : null);

      if (session !== null) {
        supabase.from("USER").select().eq("ID", session.user.id)
        .then(({ data, error }) => {
          if (error !== null) {
            console.error(error);
          } else {
            setUserData(data[0]);
          }
        });
      }
    });
  }, []);

  return (
    <Flex
      justify="center"
      bgColor={{ base: "gray.50", _dark: "gray.800" }}
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
        <ChakraLink asChild colorPalette="teal" px={4} py={2}>
          <NextLink href="/">
            <HStack gap={4}>
              <Image src={logo} alt="Education portal logo" />
              <Heading color="teal.600">Education Portal</Heading>
            </HStack>
          </NextLink>
        </ChakraLink>
        {user && userData ? (
          <HStack>
            <MenuRoot>
              <MenuTrigger>
                <Avatar name={userData.USERNAME} _hover={{ cursor: "pointer" }} />
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
              <Login />
            </HStack>
            <HStack hideFrom="md">
              <NavigationDrawer />
            </HStack>
          </>
        )}
      </Flex>
    </Flex>
  );
}
