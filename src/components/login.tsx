import LoadingContext from "@/app/loading-context";
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
import { PinInput } from "@/components/ui/pin-input";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/supabase/config";
import {
  createListCollection,
  Flex,
  HStack,
  Input,
  PinInputValueChangeDetails,
  Text,
  VStack,
} from "@chakra-ui/react";
import { validate } from "email-validator";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useRef, useState } from "react";

const accounts = createListCollection({
  items: [
    { label: "Student", value: "student" },
    { label: "Teacher", value: "teacher" },
  ],
});

export default function Login() {
  const [open, setOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [strength, setStrength] = useState(0);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [signup, setSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const otpRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const setIsLoading = useContext(LoadingContext);
  const [account, setAccount] = useState(["student"]);
  const [referral, setReferral] = useState(["", "", "", "", "", ""]);
  const [referralError, setReferralError] = useState("");

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);

    if (!isOpen) {
      setEmail("");
      setEmailError("");
      setPassword("");
      setPasswordError("");
      setStrength(0);
      setPasswordConfirm("");
      setPasswordConfirmError("");
      setOtp(["", "", "", "", "", ""]);
      setOtpSent(false);
      setOtpError("");
      setAccount([]);
      setReferral(["", "", "", "", "", ""]);
      setReferralError("");
    } else {
      setSignup(false);
    }
  }

  function handleChangeSignup(isSignup: boolean) {
    setSignup(isSignup);
    setEmailError("");
    setPasswordError("");
    emailRef.current.focus();
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    if (emailError) setEmailError("");
  }

  function validateEmail() {
    // Client validation
    const valid = validate(email);

    setEmailError(
      valid ? "" : email.length ? "Invalid email" : "Enter an email"
    );

    return valid;

    // Server validation? (e.g. email account exists)
  }

  async function checkExisting() {
    const { data, error } = await supabase
      .from("USER")
      .select()
      .eq("EMAIL", email);

    const existing = !error && data.length === 1;

    if (signup && existing) {
      setEmailError("It looks like there's already an account with this email");
    } else if (!signup && !existing) {
      setEmailError("It looks like there's no account with this email");
    }

    return existing;
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

  function validatePassword() {
    const valid = password.length > 7;
    const given = password.length > 0;
    setPasswordError(
      !given ? "Enter a password" : !valid ? "Enter at least 8 characters" : ""
    );
    return valid;
  }

  function handlePasswordConfirmChange(event: ChangeEvent<HTMLInputElement>) {
    setPasswordConfirm(event.target.value);
    if (passwordConfirmError) setPasswordConfirmError("");
  }

  function validatePasswordConfirm() {
    const valid = passwordConfirm === password;
    setPasswordConfirmError(valid ? "" : "Passwords must match");
    return valid;
  }

  function validateReferral() {
    const valid = account[0] === "student";
    setReferralError(valid ? "" : "Enter the referral code");
    return valid;
  }

  function handleReferralChange(details: PinInputValueChangeDetails) {
    setReferral(details.value);
    if (referralError) setReferralError("");
  }

  async function handleReferralComplete(details: PinInputValueChangeDetails) {
    setLoading(true);

    const { data, error } = await supabase
      .from("REFERRAL_CODE")
      .delete()
      .eq("VALUE", details.valueAsString)
      .select();

    if (error || data.length !== 1) {
      setReferralError("Invalid referral code");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        toaster.error({ title: "Signup Failed", duration: 5000 });
      } else {
        setOtpSent(true);

        const { error } = await supabase.from("USER").insert({
          ID: data.user.id,
          EMAIL: email,
          USERNAME: email.split("@")[0],
          PRIVILEGE: "teacher",
        });

        if (error) toaster.error({ title: "Signup Failed", duration: 5000 });
      }
    }

    setLoading(false);
  }

  function handleOtpChange(details: PinInputValueChangeDetails) {
    setOtp(details.value);
    if (otpError) setOtpError("");
  }

  async function handleOtpComplete(details: PinInputValueChangeDetails) {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: details.valueAsString,
      type: "email",
    });

    if (error) {
      setOtpError("Invalid verification code");
      // TODO: Refocus on first input
    } else {
      toaster.success({ title: "Signup Succeeded", duration: 5000 });
      router.push("/dashboard/units");
      handleOpenChange(false);
    }

    setLoading(false);
  }

  async function handleResendOtp() {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });

    if (error) {
      toaster.error({ title: "Failed to Resend Code", duration: 5000 });
    } else {
      setOtp(["", "", "", "", "", ""]);
      // TODO: Refocus on first input
    }

    setLoading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (signup && !otpSent) {
      if (
        !validateEmail() ||
        !validatePassword() ||
        !validatePasswordConfirm() ||
        !validateReferral() ||
        (await checkExisting())
      ) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        toaster.error({ title: "Signup Failed", duration: 5000 });
      } else {
        setOtpSent(true);

        const { error } = await supabase.from("USER").insert({
          ID: data.user.id,
          EMAIL: email,
          USERNAME: email.split("@")[0],
          PRIVILEGE: "student",
        });

        if (error) toaster.error({ title: "Signup Failed", duration: 5000 });
      }
    } else if (!signup) {
      if (!validateEmail() || !validatePassword() || !(await checkExisting())) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toaster.error({ title: "Login Failed", duration: 5000 });
      } else {
        toaster.success({ title: "Login Succeeded", duration: 5000 });
        router.push("/dashboard/units");
        handleOpenChange(false);
      }
    } else {
      await handleResendOtp();
    }

    setLoading(false);
  }

  return (
    <DialogRoot
      placement="center"
      open={open}
      onOpenChange={(details) => handleOpenChange(details.open)}
      initialFocusEl={() => emailRef.current}
    >
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button variant="ghost" colorPalette="teal">
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent colorPalette="teal">
        <DialogCloseTrigger />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{signup ? "Sign Up" : "Log In"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack gap={6} align="flex-start">
              <Field
                label="Email"
                invalid={!!emailError}
                errorText={emailError}
              >
                <Input
                  placeholder="Enter your email"
                  ref={emailRef}
                  value={email}
                  onChange={handleEmailChange}
                />
              </Field>
              <Field
                label="Password"
                invalid={!!passwordError}
                errorText={passwordError}
              >
                <PasswordInput
                  placeholder={
                    signup ? "Create a password" : "Enter your password"
                  }
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Field>
              {signup && (
                <>
                  <PasswordStrengthMeter max={5} value={strength} w="full" />
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
                    />
                  </Field>
                  <Flex
                    direction="row-reverse"
                    justify="space-between"
                    align="flex-start"
                    w="full"
                  >
                    <SelectRoot
                      collection={accounts}
                      size="md"
                      w={32}
                      variant="subtle"
                      value={account}
                      onValueChange={(details) => setAccount(details.value)}
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Account" />
                      </SelectTrigger>
                      <SelectContent zIndex="popover">
                        {accounts.items.map((item) => (
                          <SelectItem item={item} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                    {account[0] === "teacher" && (
                      <Field
                        label="Teacher Referral Code"
                        w="fit"
                        invalid={!!referralError}
                        errorText={referralError}
                      >
                        <PinInput
                          otp
                          count={6}
                          value={referral}
                          onValueChange={handleReferralChange}
                          onValueComplete={handleReferralComplete}
                        />
                      </Field>
                    )}
                  </Flex>
                </>
              )}
              {otpSent && (
                <>
                  <Field
                    label="Verification Code"
                    helperText="Enter the verification code sent to your email"
                    invalid={!!otpError}
                    errorText={otpError}
                  >
                    <PinInput
                      ref={otpRef}
                      autoFocus
                      count={6}
                      otp
                      value={otp}
                      onValueChange={handleOtpChange}
                      onValueComplete={handleOtpComplete}
                    />
                  </Field>
                  <HStack>
                    <Text>Didn't receive the code?</Text>
                    <Button variant="ghost" size="xs" onClick={handleResendOtp}>
                      Resend Code
                    </Button>
                  </HStack>
                </>
              )}
              {signup ? (
                <HStack>
                  <Text>Already have an account?</Text>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleChangeSignup(false)}
                  >
                    Log In
                  </Button>
                </HStack>
              ) : (
                <HStack>
                  <Text>Don't have an account?</Text>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleChangeSignup(true)}
                  >
                    Sign Up
                  </Button>
                </HStack>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <Button type="submit" loading={loading}>
              {signup ? "Sign Up" : "Log In"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
