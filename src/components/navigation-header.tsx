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
import supabase from "../../supabase/config";
import logo from "../app/icon.svg";
import Login from "./login";

export default function NavigationHeader() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  function handleLogout() {
    supabase.auth.signOut()
    .then(({ error }) => {
      if (!error) {
        router.push("/");
        toaster.success({
          title: "Signed Out",
          duration: 5000
        });
      } else {
        toaster.error({
          title: "Failed to Sign Out",
          duration: 5000
        });
      }
    });
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session !== null ? session.user : null);
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
            <HStack gap={4}>
              <Image src={logo} alt="Education portal logo" />
              <Heading color="teal.600">Education Portal</Heading>
            </HStack>
          </NextLink>
        </ChakraLink>
        {user !== null ? (
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
