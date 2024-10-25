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
import { DialogOpenChangeDetails, Input, Stack, Text } from "@chakra-ui/react";
import { validate } from "email-validator";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

export default function Signup({
  open,
  onOpenChange,
  onCloseSignup,
}: {
  open: boolean;
  onOpenChange: (details: DialogOpenChangeDetails) => void;
  onCloseSignup: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [passwordConfirmInvalid, setPasswordConfirmInvalid] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [passwordConfirmErrorText, setPasswordConfirmErrorText] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
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

    setPasswordErrorText(
      password.length > 0 ? "Password isn't strong enough" : "Enter a password"
    );
    setPasswordInvalid(strength === 0);
    setPasswordStrength(strength);
    return strength > 0;
  }

  function validatePasswordConfirm(passwordConfirm: string) {
    const valid = password === passwordConfirm;
    setPasswordConfirmErrorText(
      passwordConfirm.length > 0
        ? "Passwords don't match"
        : "Enter the password again"
    );
    setPasswordConfirmInvalid(!valid);
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

  function handlePasswordConfirmChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordConfirm(event.target.value);
    validatePasswordConfirm(event.target.value);
  }

  // ================================================================================
  // Form management

  function clearForm() {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setPasswordStrength(0);
    setErrorVisible(false);
    setEmailInvalid(false);
    setPasswordInvalid(false);
    setPasswordConfirmInvalid(false);
  }

  function handleOpenChange(details: DialogOpenChangeDetails) {
    clearForm();
    onOpenChange(details);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorVisible(false);

    if (
      !validateEmail(email) ||
      !validatePassword(password) ||
      !validatePasswordConfirm(passwordConfirm)
    ) {
      return;
    }

    const signupPromise = createUserWithEmailAndPassword(auth, email, password);

    signupPromise
      .then((userCredential) => {
        onCloseSignup();
        clearForm();
      })
      .catch((error) => {
        setErrorVisible(true);
      });

    toaster.promise(signupPromise, {
      success: {
        title: "Signup Success",
        description: "Successfully created account",
        duration: 5000,
      },
      error: {
        title: "Signup Failure",
        description: "Failed to create account",
        duration: 5000,
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
              {errorVisible && (
                <Text color="red.500" fontWeight="medium">
                  Failed to create account. Perhaps try a different email.
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
                errorText={passwordErrorText}
                invalid={passwordInvalid}
              >
                <PasswordInput
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Field>
              <PasswordStrengthMeter value={passwordStrength} w="full" />
              <Field
                label="Confirm Password"
                errorText={passwordConfirmErrorText}
                invalid={passwordConfirmInvalid}
              >
                <PasswordInput
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                />
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
