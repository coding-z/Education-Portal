import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { auth } from "@/firebase/config";
import { DialogOpenChangeDetails, Input, Stack } from "@chakra-ui/react";
import { validate } from "email-validator";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

export default function Login({
  open,
  onOpenChange,
  onCloseLogin,
}: {
  open: boolean;
  onOpenChange: (details: DialogOpenChangeDetails) => void;
  onCloseLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState("");
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const initialFocusRef = useRef<HTMLInputElement>(null);

  function validateEmail(email: string) {
    const valid = validate(email);
    setEmailInvalid(!valid);
    setEmailErrorText("Invalid email");
    return valid;
  }

  function validatePassword(password: string) {
    const valid = password.length > 0;
    setPasswordInvalid(!valid);
    setPasswordErrorText("Enter a password");
    return valid;
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
  }

  function handleOpenChange(details: DialogOpenChangeDetails) {
    clearInputs();
    onOpenChange(details);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateEmail(email) || !validatePassword(password)) return;

    const loginPromise = signInWithEmailAndPassword(auth, email, password);

    loginPromise
      .then((userCredential) => {
        onCloseLogin();
        clearInputs();
      })
      .catch((error) => {
        setEmailInvalid(true);
        setEmailErrorText("Email may be invalid");
        setPasswordInvalid(true);
        setPasswordErrorText("Password may be invalid");
      });

    toaster.promise(loginPromise, {
      success: {
        title: "Login Success",
        description: "Successfully logged in",
        duration: 5000,
      },
      error: {
        title: "Login Failure",
        description: "Failed to log in",
        duration: 5000,
      },
      loading: {
        title: "Signing In...",
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
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap={6}>
              <Field
                label="Email"
                errorText={emailErrorText}
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
                errorText={passwordErrorText}
                invalid={passwordInvalid}
              >
                <PasswordInput
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button type="submit" colorPalette="teal">
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
