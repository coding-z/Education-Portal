import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconButton, Link as ChakraLink, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { LuAlignJustify } from "react-icons/lu";
import { Button } from "./ui/button";

/**
 * The menu of features and options available in the dashboard once signed in.
 */
export default function Menu() {
  return (
    <DrawerRoot placement="start">
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <IconButton variant="ghost" aria-label="Open menu" colorPalette="teal">
          <LuAlignJustify />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent colorPalette="teal">
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <VStack>
            <Button w="full" variant="ghost">
              <Link href="/dashboard/units">Units</Link>
            </Button>
            <Button w="full" variant="ghost">
              <Link href="/dashboard/codes">Codes</Link>
            </Button>
          </VStack>
        </DrawerBody>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
}
