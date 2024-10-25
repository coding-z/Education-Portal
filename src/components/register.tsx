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
import { ChangeEvent, FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { toaster, Toaster } from "./ui/toaster";

export default function Register({
  open,
  handleOpenChange,
  handleCloseRegister
}: {
  open: boolean;
  handleOpenChange: (details: DialogOpenChangeDetails) => void;
  handleCloseRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    setPasswordStrength(
      (() => {
        if (password.length < 8) return 0;
        else if (password.length < 10) return 1;
        else if (password.length < 12) return 2;
        else if (password.length < 14) return 3;
        else return 4;
      })()
    );
  }

  function clearInputs() {
    setEmail("");
    setPassword("");
    setPasswordStrength(0);
  }

  function validatePassword() {}

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(email, password);

    const registerPromise = createUserWithEmailAndPassword(auth, email, password);
    
    registerPromise
      .then((userCredential) => {
        console.log(userCredential);
        handleCloseRegister();
        clearInputs();
      })
      .catch((error) => {
        console.error(error);
      });

      toaster.promise(registerPromise, {
        success: {
          title: "Registration Success",
          description: "Successfully created account"
        },
        error: {
          title: "Registration Error",
          description: "Failed to create account"
        },
        loading: {
          title: "Registering...",
          description: "Creating account..."
        }
      });
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={handleOpenChange}
      placement="center"
      closeOnInteractOutside={false}
    >
      <DialogContent>
        <DialogCloseTrigger />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap={6}>
              <Field label="Email">
                <Input
                  colorPalette="teal"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </Field>
              <Field label="Password">
                <PasswordInput
                  colorPalette="teal"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <PasswordStrengthMeter value={passwordStrength} w="full" />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button type="submit" colorPalette="teal">
              Sign Up
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
