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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { toaster, Toaster } from "./ui/toaster";

export default function Login({
  open,
  handleOpenChange,
  handleCloseLogin
}: {
  open: boolean;
  handleOpenChange: (details: DialogOpenChangeDetails) => void;
  handleCloseLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function clearInputs() {
    setEmail("");
    setPassword("");
  }

  function validatePassword() {}

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(email, password);

    const signinPromise = signInWithEmailAndPassword(auth, email, password);
    
    signinPromise
      .then((userCredential) => {
        console.log(userCredential);
        handleCloseLogin();
        clearInputs();
      })
      .catch((error) => {
        console.error(error);
      });

    toaster.promise(signinPromise, {
      success: {
        title: "Signed In",
        description: "Successfully signed in"
      },
      error: {
        title: "Sign In Error",
        description: "Failed to sign in"
      },
      loading: {
        title: "Signing In...",
        description: "Please wait..."
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
            <DialogTitle>Sign In</DialogTitle>
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
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button type="submit" colorPalette="teal">
              Sign In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
