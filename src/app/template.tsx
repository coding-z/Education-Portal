"use client";

import Login from "@/components/login";
import Signup from "@/components/signup";
import { Button } from "@/components/ui/button";
import { toaster, Toaster } from "@/components/ui/toaster";
import { auth } from "@/firebase/config";
import {
  DialogOpenChangeDetails,
  Flex,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState } from "react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  function handleCloseLogin() {
    setLoginOpen(false);
  }

  function handleLoginOpenChange(details: DialogOpenChangeDetails) {
    setLoginOpen(details.open);
  }

  function handleLogout() {
    const signoutPromise = auth.signOut();

    toaster.promise(signoutPromise, {
      success: {
        title: "Signed Out",
        description: "Successfully signed out",
        duration: 5000
      },
      error: {
        title: "Signout Error",
        description: "Failed to sign out",
        duration: 5000
      },
      loading: {
        title: "Signing Out...",
        description: "Please wait"
      }
    });
  }

  // ================================================================================
  // Checking for logged in user

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return (
    <>
      <Flex
        justify="space-around"
        bgColor="gray.50"
        shadow="sm"
        minH={16}
        align="center"
        w="full"
      >
        <Heading color="teal.600">Education Portal</Heading>
        {user ? (
          <HStack>
            <Text>{user.email}</Text>
            <Button
              color="teal.600"
              borderColor="teal.600"
              variant="outline"
              onClick={handleLogout}
            >
              Log Out
            </Button>
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
