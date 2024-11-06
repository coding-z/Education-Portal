import { DrawerActionTrigger, DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DrawerOpenChangeDetails, Flex, IconButton } from "@chakra-ui/react";
import { LuAlignJustify, LuX } from "react-icons/lu";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NavigationDrawer({ onOpenSignup, onOpenLogin }: { onOpenSignup: () => void; onOpenLogin: () => void; }) {
  const [open, setOpen] = useState(false);

  function handleOpenChange(details: DrawerOpenChangeDetails) {
    setOpen(details.open);
  }

  function handleOpenSignup() {
    setOpen(false);
    onOpenSignup();
  }

  function handleOpenLogin() {
    setOpen(false);
    onOpenLogin();
  }
  
  return (
    <DrawerRoot size={{ base: "full", sm: "xs" }} open={open} onOpenChange={handleOpenChange}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <IconButton variant="ghost" colorPalette="teal" aria-label="Open Menu">
          <LuAlignJustify />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent colorPalette="teal">
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Flex direction="row" justify="flex-end" align="center" gap={4}>
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
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
}
