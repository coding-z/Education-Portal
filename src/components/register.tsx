import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogOpenChangeDetails, Input } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

export default function Register({
  open,
  handleOpenChange,
}: {
  open: boolean;
  handleOpenChange: (details: DialogOpenChangeDetails) => void;
}) {
  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange} placement="center">
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Input placeholder="Email" />
        </DialogBody>
        <DialogFooter>
          <Button colorPalette="teal">Sign Up</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
