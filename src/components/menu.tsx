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
import { IconButton } from "@chakra-ui/react";
import { LuAlignJustify } from "react-icons/lu";

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
          <p>Hello there</p>
        </DrawerBody>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
}
