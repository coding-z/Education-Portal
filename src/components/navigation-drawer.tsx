import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DrawerOpenChangeDetails, Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { LuAlignJustify } from "react-icons/lu";
import Login from "./login";

export default function NavigationDrawer() {
  const [open, setOpen] = useState(false);

  function handleOpenChange(details: DrawerOpenChangeDetails) {
    setOpen(details.open);
  }

  return (
    <DrawerRoot
      size={{ base: "full", sm: "xs" }}
      open={open}
      onOpenChange={handleOpenChange}
    >
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
            <Login />
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
}
