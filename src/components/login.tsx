// import { Button } from "@/components/ui/button";
// import {
//   DialogBody,
//   DialogCloseTrigger,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogRoot,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Field } from "@/components/ui/field";
// import { PasswordInput } from "@/components/ui/password-input";
// import { toaster } from "@/components/ui/toaster";
// import { DialogOpenChangeDetails, Input, PinInputValueChangeDetails, Stack, Text } from "@chakra-ui/react";
// import { validate } from "email-validator";
// import { ChangeEvent, FormEvent, useRef, useState } from "react";
// import supabase from "../../supabase/config";
// import { PinInput } from "@/components/ui/pin-input";

import { DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { DialogOpenChangeDetails, Input, PinInputValueChangeDetails } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { validate } from "email-validator";
import supabase from "../../supabase/config";
import { PinInput } from "@/components/ui/pin-input";

export default function Login() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  
  function handleOpenChange(details: DialogOpenChangeDetails) {
    setOpen(details.open);

    if (!details.open) {
      clear();
    }
  }

  function getRef() {
    return ref.current;
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
        type: "email"
      });

      if (error !== null) {
        setOtpError("Invalid passcode");
      } else {
        console.log(data);
        setOpen(false);
        clear();
      }
    }
    
    setLoading(false);
  }

  function handleOtpChange(details: PinInputValueChangeDetails) {
    setOtp(details.value);
  }
  
  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange} placement="center" initialFocusEl={getRef}>
      <DialogBackdrop />
      <DialogTrigger asChild colorPalette="teal">
        <Button variant="ghost">Log In</Button>
      </DialogTrigger>
      <DialogContent colorPalette="teal">
        <DialogCloseTrigger />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Field label="Email" helperText="A login code will be sent to this email" invalid={emailError !== null} errorText={emailError}>
              <Input ref={ref} placeholder="me@example.com" value={email} onChange={handleEmailChange} />
            </Field>
            {
              otpSent && 
              <Field label="Passcode" helperText="Enter the code sent to your email" invalid={otpError !== null} errorText={otpError}>
                <PinInput count={6} otp value={otp} onValueChange={handleOtpChange} />
              </Field>
            }
          </DialogBody>
          <DialogFooter>
            <Button loading={loading} type="submit">Log In</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

// export default function Login({
//   open,
//   onOpenChange,
//   onLoginSuccess,
// }: {
//   open: boolean;
//   onOpenChange: (details: DialogOpenChangeDetails) => void;
//   onLoginSuccess: () => void;
// }) {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [password, setPassword] = useState("");
//   const [errorVisible, setErrorVisible] = useState(false);
//   const [emailInvalid, setEmailInvalid] = useState(false);
//   const [passwordInvalid, setPasswordInvalid] = useState(false);
//   const [emailErrorText, setEmailErrorText] = useState("");
//   const initialFocusRef = useRef<HTMLInputElement>(null);

//   // ================================================================================
//   // Client validation

//   function validateEmail(email: string) {
//     const valid = validate(email);
//     setEmailErrorText(email.length > 0 ? "Invalid email" : "Enter an email");
//     setEmailInvalid(!valid);
//     return valid;
//   }

//   function validatePassword(password: string) {
//     const valid = password.length > 0;
//     setPasswordInvalid(!valid);
//     return valid;
//   }

//   // ================================================================================
//   // Event handling

//   function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
//     setEmail(event.target.value);
//     validateEmail(event.target.value);
//   }

//   function handleOtpChange(details: PinInputValueChangeDetails) {
//     setOtp(details.value);
//   }

//   // ================================================================================
//   // Form management

//   function clearForm() {
//     setEmail("");
//     setPassword("");
//     setErrorVisible(false);
//     setEmailInvalid(false);
//     setPasswordInvalid(false);
//   }

//   function handleOpenChange(details: DialogOpenChangeDetails) {
//     clearForm();
//     onOpenChange(details);
//   }

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setErrorVisible(false);

//     if (!validateEmail(email) || !validatePassword(password)) return;

//     // const loginPromise = signInWithEmailAndPassword(auth, email, password);
//     const loginPromise = supabase.auth.signInWithPassword({ email, password });

//     loginPromise
//       .then((userCredential) => {
//         onLoginSuccess();
//         clearForm();
//       })
//       .catch((error) => {
//         setErrorVisible(true);
//       });

//     toaster.promise(loginPromise, {
//       success: {
//         title: "Login Success",
//         description: "Successfully logged in",
//         duration: 5000,
//       },
//       error: {
//         title: "Login Failure",
//         description: "Failed to log in",
//         duration: 5000,
//       },
//       loading: {
//         title: "Signing In...",
//         description: "Please wait",
//       },
//     });
//   }

//   return (
//     <DialogRoot
//       open={open}
//       onOpenChange={handleOpenChange}
//       placement="center"
//       closeOnInteractOutside={false}
//       initialFocusEl={() => initialFocusRef.current}
//     >
//       <DialogContent colorPalette="teal">
//         <DialogCloseTrigger />
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Login</DialogTitle>
//           </DialogHeader>
//           <DialogBody>
//             <Stack gap={6}>
//               <Field
//                 label="Email"
//                 errorText={emailErrorText}
//                 invalid={emailInvalid}
//               >
//                 <Input
//                   type="email"
//                   value={email}
//                   onChange={handleEmailChange}
//                   ref={initialFocusRef}
//                   placeholder="me@example.com"
//                 />
//               </Field>
//               <Field
//                 label="Passcode"
//                 errorText="Enter the one-time passcode you received"
//                 invalid={passwordInvalid}
//               >
//                 <PinInput otp
//                   value={otp}
//                   onValueChange={handleOtpChange}
//                 />
//               </Field>
//             </Stack>
//           </DialogBody>
//           <DialogFooter>
//             <Button type="submit" colorPalette="teal">
//               Login
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </DialogRoot>
//   );
// }
