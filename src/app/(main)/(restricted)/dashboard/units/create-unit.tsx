import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
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
import { toaster } from "@/components/ui/toaster";
import supabase from "@/supabase/config";
import { chakra, Input, useRecipe, VStack } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import AutoResize from "react-textarea-autosize";

const StyledAutoResize = chakra(AutoResize);

export default function CreateUnit({ reloadUnits }: { reloadUnits: () => void; }) {
  const recipe = useRecipe({ key: "textarea" });
  const styles = recipe({ size: "sm" });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [name, setName] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [description, setDescription] = useState("");

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);

    if (!isOpen) {
      setCode("");
      setCodeInvalid(false);
      setName("");
      setNameInvalid(false);
      setDescription("");
    }
  }

  function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
    setCode(event.target.value);
    if (codeInvalid) setCodeInvalid(false);
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
    if (nameInvalid) setNameInvalid(false);
  }

  function validate() {
    setCodeInvalid(!code);
    setNameInvalid(!name);
    return !!code && !!name;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (validate()) {
      const { error } = await supabase
        .from("UNIT")
        .insert({ CODE: code, NAME: name, DESCRIPTION: description });

      if (error) {
        toaster.error({ title: "Failed to Create Unit", duration: 5000 });
        console.error(error);
      } else {
        toaster.success({ title: "Created Unit", duration: 5000 });
        handleOpenChange(false);
        reloadUnits();
      }
    }

    setLoading(false);
  }

  return (
    <DialogRoot
      placement="center"
      open={open}
      onOpenChange={(details) => handleOpenChange(details.open)}
      initialFocusEl={() => codeRef.current}
    >
      <DialogBackdrop />
      <DialogTrigger asChild colorPalette="teal">
        <Button>Create Unit</Button>
      </DialogTrigger>
      <DialogContent colorPalette="teal">
        <DialogCloseTrigger />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Unit</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack gap={6}>
              <Field
                label="Unit Code"
                invalid={codeInvalid}
                errorText="Enter the unit code"
              >
                <Input
                  placeholder="Enter the unit code e.g. MAN9035"
                  ref={codeRef}
                  value={code}
                  onChange={handleCodeChange}
                />
              </Field>
              <Field
                label="Unit Name"
                invalid={nameInvalid}
                errorText="Enter the unit name"
              >
                <Input
                  placeholder="Enter the unit name"
                  value={name}
                  onChange={handleNameChange}
                />
              </Field>
              <Field label="Description">
                <StyledAutoResize
                  placeholder="Enter a description"
                  minH="initial"
                  resize="none"
                  overflow="hidden"
                  lineHeight="inherit"
                  css={styles}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Field>
            </VStack>
          </DialogBody>
          <DialogFooter>
            {!loading && (
              <DialogActionTrigger asChild>
                <Button variant="subtle" colorPalette="gray" color="teal.600">
                  Cancel
                </Button>
              </DialogActionTrigger>
            )}
            <Button type="submit" loading={loading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
