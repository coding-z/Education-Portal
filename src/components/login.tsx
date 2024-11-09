import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import supabase from "@/supabase/config";
import { DialogOpenChangeDetails, Input, VStack } from "@chakra-ui/react";
import { validate } from "email-validator";
import { ChangeEvent, useRef, useState } from "react";

export default function Login() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Log In");
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [emailHelp, setEmailHelp] = useState("");
  const [emailError, setEmailError] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState(
    "Enter your password"
  );
  const [passwordError, setPasswordError] = useState("");
  const [showStrength, setShowStrength] = useState(false);
  const [strength, setStrength] = useState(0);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  function handleOpenChange(details: DialogOpenChangeDetails) {
    setOpen(details.open);

    if (!details.open) {
      setTitle("Log In");
      setEmail("");
      setEmailHelp("");
      setEmailError("");
      setPassword("");
      setPasswordPlaceholder("Enter your password");
      setPasswordError("");
      setShowStrength(false);
      setStrength(0);
      setShowPasswordConfirm(false);
      setPasswordConfirm("");
      setPasswordConfirmError("");
    }
  }

  function showSignup(show: boolean) {
    setTitle(show ? "Sign Up" : "Log In");
    setEmailHelp(show ? "Looks like you don't have an account. Sign up?" : "");
    setPasswordPlaceholder(show ? "Create a password" : "Enter your password");
    setShowStrength(show);
    setShowPasswordConfirm(show);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    if (emailError) setEmailError("");
  }

  async function handleEmailComplete(event: ChangeEvent<HTMLInputElement>) {
    // Client validation
    const valid = validate(email);

    setEmailError(
      valid ? "" : email.length ? "Invalid email" : "Enter an email"
    );

    if (!valid) {
      emailRef.current.focus();
      return;
    }

    // Server validation? (e.g. email account exists)

    // Check for existing account
    const { data, error } = await supabase
      .from("USER")
      .select()
      .eq("EMAIL", email);

    if (error) console.error(error);
    showSignup(!error && !data.length);
  }

  function checkStrength(password: string) {
    // 0 -> less than 8 characters
    // 1 -> 8+ characters, one of (upper, lower, numbers, special)
    // 2 -> 8+ characters, two of (upper, lower, numbers, special)
    // 3 -> 8+ characters, three of (upper, lower, numbers, special)
    // 4 -> 8+ characters, all of (upper, lower, numbers, special)
    // 5 -> 16+ characters
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const checks = [hasUpper, hasLower, hasNumber, hasSpecial];
    const checksCount = checks.filter((item) => item).length;

    if (password.length < 8) {
      return 0;
    } else if (password.length < 16) {
      return checksCount;
    } else {
      return 5;
    }
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    if (passwordError) setPasswordError("");
    setStrength(checkStrength(event.target.value));
  }

  function handlePasswordComplete(event: ChangeEvent<HTMLInputElement>) {
    const valid = password.length > 7;
    setPasswordError(valid ? "" : "Enter at least 8 characters");
    if (!valid) passwordRef.current.focus();
  }

  function handlePasswordConfirmChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordConfirm(event.target.value);
    if (passwordConfirmError) setPasswordConfirmError("");
  }

  function handlePasswordConfirmComplete(event: ChangeEvent<HTMLInputElement>) {
    const valid = passwordConfirm === password;
    setPasswordConfirmError(valid ? "" : "Passwords must match");
    if (!valid) passwordConfirmRef.current.focus();
  }

  return (
    <DialogRoot
      placement="center"
      open={open}
      onOpenChange={handleOpenChange}
      initialFocusEl={() => emailRef.current}
    >
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button variant="ghost" color="teal.600">
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent colorPalette="teal">
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack gap={6}>
            <Field
              label="Email"
              invalid={!!emailError}
              errorText={emailError}
              helperText={emailHelp}
            >
              <Input
                placeholder="Enter your email"
                ref={emailRef}
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailComplete}
              />
            </Field>
            <Field
              label="Password"
              invalid={!!passwordError}
              errorText={passwordError}
            >
              <PasswordInput
                placeholder={passwordPlaceholder}
                ref={passwordRef}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordComplete}
              />
            </Field>
            {showStrength && (
              <PasswordStrengthMeter max={5} value={strength} w="full" />
            )}
            {showPasswordConfirm && (
              <Field
                label="Confirm Password"
                invalid={!!passwordConfirmError}
                errorText={passwordConfirmError}
              >
                <PasswordInput
                  placeholder="Re-enter the password"
                  ref={passwordConfirmRef}
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  onBlur={handlePasswordConfirmComplete}
                />
              </Field>
            )}
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button>Log In</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
