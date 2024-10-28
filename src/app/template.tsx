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
import { auth } from "@/firebase/config";
import {
  Link as ChakraLink,
  DialogOpenChangeDetails,
  Flex,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    router.push("/dashboard");
    console.log("routing");
  }

  function handleLoginOpenChange(details: DialogOpenChangeDetails) {
    setLoginOpen(details.open);
  }

  function handleLogout() {
    const signoutPromise = auth.signOut();

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

  // ================================================================================
  // Checking for logged in user

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <>
      <Flex
        justify="center"
        bgColor="gray.50"
        shadow="sm"
        minH={16}
        align="center"
        w="full"
        zIndex="docked"
      >
        <Flex
          flexGrow={1}
          justify="space-between"
          align="center"
          px={14}
          py={2}
        >
          <ChakraLink asChild colorPalette="teal" p={2}>
            <Link href="/">
              <Heading color="teal.600">Education Portal</Heading>
            </Link>
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
                Log In
              </Button>
            </HStack>
          )}
        </Flex>
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
      {children}
    </>
  );
}
