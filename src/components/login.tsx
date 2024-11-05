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
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { auth } from "@/firebase/config";
import { DialogOpenChangeDetails, Input, Stack, Text } from "@chakra-ui/react";
import { validate } from "email-validator";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

export default function Login({
  open,
  onOpenChange,
  onLoginSuccess,
}: {
  open: boolean;
  onOpenChange: (details: DialogOpenChangeDetails) => void;
  onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState("");
  const initialFocusRef = useRef<HTMLInputElement>(null);

  // ================================================================================
  // Client validation

  function validateEmail(email: string) {
    const valid = validate(email);
    setEmailErrorText(email.length > 0 ? "Invalid email" : "Enter an email");
    setEmailInvalid(!valid);
    return valid;
  }

  function validatePassword(password: string) {
    const valid = password.length > 0;
    setPasswordInvalid(!valid);
    return valid;
  }

  // ================================================================================
  // Event handling

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    validateEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    validatePassword(event.target.value);
  }

  // ================================================================================
  // Form management

  function clearForm() {
    setEmail("");
    setPassword("");
    setErrorVisible(false);
    setEmailInvalid(false);
    setPasswordInvalid(false);
  }

  function handleOpenChange(details: DialogOpenChangeDetails) {
    clearForm();
    onOpenChange(details);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorVisible(false);

    if (!validateEmail(email) || !validatePassword(password)) return;

    const loginPromise = signInWithEmailAndPassword(auth, email, password);

    loginPromise
      .then((userCredential) => {
        onLoginSuccess();
        clearForm();
      })
      .catch((error) => {
        setErrorVisible(true);
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
              {errorVisible && (
                <Text color="red.500" fontWeight="medium">
                  Invalid email and/or password.
                </Text>
              )}
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
                errorText="Enter a password"
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
