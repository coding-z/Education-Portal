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
  createListCollection,
  DialogOpenChangeDetails,
  Input,
  PinInputValueChangeDetails,
  SelectValueChangeDetails,
  Text,
  VStack,
} from "@chakra-ui/react";
import { validate } from "email-validator";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import supabase from "../supabase/config";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

const accountTypes = createListCollection({
  items: [
    { label: "Student", value: "student" },
    { label: "Teacher", value: "teacher" },
  ],
});

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
  const [account, setAccount] = useState<string[]>(["student"]);
  const [referralCodeError, setTeacherPinError] = useState<string | null>(null);
  const [teacherPin, setTeacherPin] = useState(["", "", "", "", "", ""]);
  const [validTeacherPin, setValidTeacherPin] = useState(false);
  const [signup, setSignup] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  function handleAccountChange(details: SelectValueChangeDetails) {
    setAccount(details.value);
    console.log(details.value);
  }

  function handleOpenChange(details: DialogOpenChangeDetails) {
    setOpen(details.open);

    if (!details.open) {
      clear();
    }
  }

  function getEmailRef() {
    return emailRef.current;
  }

  

  
  // DIALOG HANDLING, REFS, UTILITIES & OTHER
  
  function clear() {
    setEmail("");
    setEmailError(null);
    setOtp(["", "", "", "", "", ""]);
    setOtpSent(false);
    setOtpError(null);
  }
  
  // CLIENT-SIDE VALIDATION

  function validateEmail() {
    const valid = validate(email);

    if (valid) {
      setEmailError(null);
    } else {
      setEmailError(email.length > 0 ? "Invalid email" : "Enter an email");
    }

    return valid;
  }
  
  // CONTROLLED-INPUT HANDLING

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setEmailError(null);
  }

  function handleOtpChange(details: PinInputValueChangeDetails) {
    setOtp(details.value);
    setOtpError(null);
  }

  async function handleOtpComplete() {
    const response = await supabase.auth.verifyOtp({
      email,
      token: otp.join(""),
      type: "email"
    });

    console.log(response);

    if (response.error !== null) {
      setOtpError("Invalid passcode. Double-check or retry after a minute.");
      otpRef.current.blur();
      otpRef.current.focus();
    } else {
      setOpen(false);
      clear();
      toaster.success({
        title: "Logged In",
        duration: 5000,
      });
      router.push("/dashboard/units");
    }
  }

  // LOGIN SUBMISSION

  /**
   * Handles submitting the email for further information
   */
  function handleSubmitEmailCheck() {

  }

  /**
   * Handles submitting a request for the OTP to be emailed
   */
  async function handleSubmitOtpRequest() {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error !== null) {
      setEmailError("Something went wrong. Try a different email?");
    } else {
      setOtpSent(true);
    }
  }

  /**
   * Handles submitting the OTP for verification
   */
  function handleSubmitOtpVerify() {

  }

  /**
   * Handles submitting the referral code for verification
   */
  function handleSubmitReferralVerify() {

  }

  /**
   * Handles submitting the login details by the main submission button
   */
  // function handleSubmit() {

  // }





  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    // Client-verification of email
    if (!validateEmail()) {
      setLoading(false);
      return;
    }

    // Check for existing account with given email
    const { data, error } = await supabase.from("USER").select().eq("EMAIL", email);

    if (error !== null || data.length !== 1) {
      // Signup path
      setSignup(true);
    } else {
      // Login path
      const { data, error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
      
      if (error !== null) {
        setEmailError("Something went wrong. Try a different email?");
      } else {
        setOtpSent(true);
      }
    }

    // if (!otpSent) {
    //   const emailValid = validateEmail();

    //   if (emailValid) {
    //     handleSubmitOtpRequest();
    //     // if (account[0] === "teacher" && validTeacherPin) {
    //     //   handleSubmitOtpRequest();
    //     // } else {
    //     //   setTeacherPinError("Enter the teacher code");
    //     // }
    //   }
    // } else {
    //   const { data, error } = await supabase.auth.verifyOtp({
    //     email,
    //     token: otp.join(""),
    //     type: "email",
    //   });

    //   if (error !== null) {
    //     setOtpError("Invalid passcode. Double-check or retry after a minute.");
    //   } else {
    //     supabase.from("USER").select().eq("ID", data.user.id)
    //     .then(async ({data, error}) => {
    //       if (data.length === 0 && error === null) {
    //         const { error } = await supabase.from("USER").insert({
    //           ID: data.user.id,
    //           EMAIL: email,
    //           USERNAME: email.split("@")[0],
    //           PRIVILEGE: "teacher",
    //         });
    //       }
    //     })

    //     if (error) {
    //       console.error(error);
    //     } else {
    //       console.log(data);
    //       setOpen(false);
    //       clear();
    //       toaster.success({
    //         title: "Logged In",
    //         duration: 5000,
    //       });
    //       router.push("/dashboard/units");
    //     }
    //   }
    // }

    setLoading(false);
  }

  function handleReferralCodeChange(details: PinInputValueChangeDetails) {
    setTeacherPin(details.value.map((item) => item.toUpperCase()));
    setTeacherPinError(null);
  }

  function handleReferralCodeComplete(details: PinInputValueChangeDetails) {
    // Verify the pin without consuming it
    console.log("verifying...", details.value.join(""));
    supabase
      .from("SIGNUP_CODE")
      .select()
      .eq("VALUE", details.value.join(""))
      .then(async ({ data, error }) => {
        console.log(data, error);
        if (error !== null || data.length !== 1) {
          setTeacherPinError("Invalid teacher code");
          console.log("invalid");
          setValidTeacherPin(false);
        } else {
          console.log("valid");
          setValidTeacherPin(true);
          const { error } = await supabase.auth.signInWithOtp({ email });

          if (error !== null) {
            setEmailError("Something went wrong. Try a different email?");
          } else {
            setOtpSent(true);
          }
          // submitRef.current.focus();
        }
      });
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
                An account will be created if you don't already have one.
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
              {signup && (
                <SelectRoot
                  collection={accountTypes}
                  value={account}
                  onValueChange={handleAccountChange}
                >
                  <SelectLabel>Account Type</SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent zIndex="popover">
                    {accountTypes.items.map((item) => (
                      <SelectItem item={item} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
              {signup && account[0] === "teacher" && (
                <Field
                  label="Referral Code"
                  helperText="Enter your referral code"
                  invalid={referralCodeError !== null}
                  errorText={referralCodeError}
                >
                  <PinInput
                    count={6}
                    type="alphanumeric"
                    pattern="[A-Za-z0-9]"
                    value={teacherPin}
                    onValueComplete={handleReferralCodeComplete}
                    onValueChange={handleReferralCodeChange}
                  />
                </Field>
              )}
              {otpSent && (
                <Field
                  label="Passcode"
                  helperText="Enter the code sent to your email"
                  invalid={otpError !== null}
                  errorText={otpError}
                >
                  <PinInput
                    onValueComplete={handleOtpComplete}
                    autoFocus
                    count={6}
                    otp
                    ref={otpRef}
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
