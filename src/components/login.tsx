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
import { PinInput } from "@/components/ui/pin-input";
import { toaster } from "@/components/ui/toaster";
import {
  DialogOpenChangeDetails,
  Input,
  PinInputValueChangeDetails,
  Text,
  VStack,
} from "@chakra-ui/react";
import { validate } from "email-validator";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import supabase from "../supabase/config";

export default function Login() {
  const [open, setOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function handleOpenChange(details: DialogOpenChangeDetails) {
    setOpen(details.open);

    if (!details.open) {
      clear();
    }
  }

  function getEmailRef() {
    return emailRef.current;
  }

  function validateEmail() {
    const valid = validate(email);

    if (valid) {
      setEmailError(null);
    } else {
      setEmailError(email.length > 0 ? "Invalid email" : "Enter an email");
    }

    return valid;
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setEmailError(null);
  }

  function clear() {
    setEmail("");
    setEmailError(null);
    setOtp(["", "", "", "", "", ""]);
    setOtpSent(false);
    setOtpError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (!otpSent) {
      const emailValid = validateEmail();

      if (emailValid) {
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error !== null) {
          setEmailError("Something went wrong. Try a different email?");
        } else {
          setOtpSent(true);
        }
      }
    } else {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp.join(""),
        type: "email",
      });

      if (error !== null) {
        setOtpError("Invalid passcode. Double-check or retry after a minute.");
      } else {
        const { error } = await supabase
          .from("USER")
          .insert({ ID: data.user.id, EMAIL: email, USERNAME: email.split("@")[0], PRIVILEGE: "teacher" });

        if (error) {
          console.error(error);
        } else {
          console.log(data);
          setOpen(false);
          clear();
          toaster.success({
            title: "Logged In",
            duration: 5000,
          });
          router.push("/dashboard/units");
        }
      }
    }

    setLoading(false);
  }

  function handleOtpChange(details: PinInputValueChangeDetails) {
    setOtp(details.value);
  }

  function handlePinComplete() {
    // Focus the submit button for convenience
    // Potentially auto submit the form using formRef
    submitRef.current.focus();
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={handleOpenChange}
      placement="center"
      initialFocusEl={getEmailRef}
    >
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button variant="ghost" color="teal.600">
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent colorPalette="teal">
        <DialogCloseTrigger />
        <form onSubmit={handleSubmit} ref={formRef}>
          <DialogHeader>
            <VStack gap={2} align="flex-start">
              <DialogTitle>Log In</DialogTitle>
              <Text>
                An account will be created for you if you don't already have
                one.
              </Text>
            </VStack>
          </DialogHeader>
          <DialogBody>
            <VStack gap={8}>
              <Field
                label="Email"
                helperText="A login code will be sent to this email"
                invalid={emailError !== null}
                errorText={emailError}
              >
                <Input
                  ref={emailRef}
                  placeholder="me@example.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Field>
              {otpSent && (
                <Field
                  label="Passcode"
                  helperText="Enter the code sent to your email"
                  invalid={otpError !== null}
                  errorText={otpError}
                >
                  <PinInput
                    onValueComplete={handlePinComplete}
                    autoFocus
                    count={6}
                    otp
                    value={otp}
                    onValueChange={handleOtpChange}
                  />
                </Field>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <Button ref={submitRef} loading={loading} type="submit">
              Log In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
