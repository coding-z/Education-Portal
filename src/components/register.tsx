import { Button } from "./ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "./ui/field";
import { DialogOpenChangeDetails, Input, Stack } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "./ui/password-input";

export default function Register({
  open,
  handleOpenChange,
}: {
  open: boolean;
  handleOpenChange: (details: DialogOpenChangeDetails) => void;
}) {
  return (
    <DialogRoot
      open={open}
      onOpenChange={handleOpenChange}
      placement="center"
      closeOnInteractOutside={false}
    >
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap={6}>
            <Field label="Email">
              <Input colorPalette="teal" />
            </Field>
            <Field label="Password">
              <PasswordInput colorPalette="teal" />
              <PasswordStrengthMeter value={4} w="full" />
            </Field>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <Button colorPalette="teal">Sign Up</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
