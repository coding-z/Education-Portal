import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { auth } from "@/firebase/config";
import { DialogOpenChangeDetails, Input, Stack } from "@chakra-ui/react";
import { validate } from "email-validator";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { PasswordInput, PasswordStrengthMeter } from "./ui/password-input";
import { toaster } from "./ui/toaster";

export default function Signup({
  open,
  onOpenChange,
  onCloseRegister,
}: {
  open: boolean;
  onOpenChange: (details: DialogOpenChangeDetails) => void;
  onCloseRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  function validateEmail(email: string) {
    const valid = validate(email);
    setEmailInvalid(!valid);
    return valid;
  }

  function validatePassword(password: string) {
    /**
     * Password requirements:
     * - At least 8 characters
     *
     * Password strength indicators:
     * - Includes lowercase
     * - Includes uppercase
     * - Includes special characters
     * - Includes digits
     * - Is long (16+ characters)
     */
    let strength: number;

    if (password.length < 8) {
      strength = 0;
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      strength = 1;
    } else if (!/[^a-zA-Z0-9]/.test(password) || !/[0-9]/.test(password)) {
      strength = 2;
    } else if (password.length < 16) {
      strength = 3;
    } else {
      strength = 4;
    }

    setPasswordInvalid(strength === 0);
    setPasswordStrength(strength);
    return strength > 0;
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    validateEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    validatePassword(event.target.value);
  }

  function clearInputs() {
    setEmail("");
    setEmailInvalid(false);
    setPassword("");
    setPasswordInvalid(false);
    setPasswordStrength(0);
  }

  function handleOpenChange(details: DialogOpenChangeDetails) {
    clearInputs();
    onOpenChange(details);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateEmail(email) || !validatePassword(password)) return;

    console.log(email, password);

    const signupPromise = createUserWithEmailAndPassword(auth, email, password);

    signupPromise
      .then((userCredential) => {
        console.log(userCredential);
        onCloseRegister();
        clearInputs();
      })
      .catch((error) => {
        console.error(error);
      });

    toaster.promise(signupPromise, {
      success: {
        title: "Sign Up Successful",
        description: "Successfully created account",
      },
      error: {
        title: "Sign Up Failed",
        description: "Failed to create account",
      },
      loading: {
        title: "Creating Account...",
        description: "Please wait",
      },
    });
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={handleOpenChange}
      placement="center"
      closeOnInteractOutside={false}
      initialFocusEl={() => initialFocusRef.current}
    >
      <DialogContent colorPalette="teal">
        <DialogCloseTrigger />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap={6}>
              <Field
                label="Email"
                errorText="Invalid email"
                invalid={emailInvalid}
              >
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  ref={initialFocusRef}
                />
              </Field>
              <Field
                label="Password"
                errorText="Password isn't strong enough"
                invalid={passwordInvalid}
              >
                <PasswordInput
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Field>
              <PasswordStrengthMeter value={passwordStrength} w="full" />
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
