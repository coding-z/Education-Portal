"use client";

import { Button } from "@/components/ui/button";
import { ClipboardIconButton, ClipboardInput, ClipboardLabel, ClipboardRoot } from "@/components/ui/clipboard";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PinInput } from "@/components/ui/pin-input";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/supabase/config";
import { Tables } from "@/supabase/supabase";
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  PinInputValueChangeDetails,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";

/**
 * A management panel for codes generated to create privileged accounts.
 */
export default function Codes() {
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codes, setCodes] = useState<Tables<"REFERRAL_CODE">[]>([]);

  function handleCodeChange(details: PinInputValueChangeDetails) {
    setCode(details.value.map((item) => item.toUpperCase()));
  }

  function handleClearCode() {
    setCode(["", "", "", "", "", ""]);
    setShowCode(false);
  }

  function handleGenerateCode() {
    const newCode = ["", "", "", "", "", ""];
    return newCode.map(_ => String(Math.floor(Math.random() * 10)));
  }

  function handleCreateCode() {
    const newCode = handleGenerateCode();
    console.log(newCode);

    supabase
      .from("REFERRAL_CODE")
      .insert({ VALUE: newCode.join("") })
      .then(({ error }) => {
        if (error !== null) {
          console.error(error);
          toaster.error({
            title: "Failed to Create Code",
            duration: 5000,
          });
        } else {
          fetchCodes();
          setCode(newCode);
          setShowCode(true);
          toaster.success({
            title: "Created Code",
            duration: 5000,
          });
        }
      });
  }

  function fetchCodes() {
    supabase
      .from("REFERRAL_CODE")
      .select()
      .then(({ data, error }) => {
        if (error !== null) {
          console.error(error);
        } else {
          setCodes([...data]);
        }
      });
  }

  useEffect(fetchCodes, []);

  function handleDeleteCode(value: string) {
    console.log("Deleting", value);
    supabase
      .from("REFERRAL_CODE")
      .delete()
      .eq("VALUE", value)
      .then((response) => {
        console.log(response);
        toaster.success({
          title: "Deleted Code",
          duration: 5000,
        });
        fetchCodes();
      });
  }

  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="center"
      flexGrow={1}
      w="full"
      px={{ base: 6, md: 12, lg: 20 }}
      py={8}
      gap={8}
    >
      <Flex direction="row" justify="flex-start" align="center" w="full">
        <Heading>Referral Codes</Heading>
      </Flex>
      <Field
        label="Create Code"
        helperText="Enter a new referral code"
      >
        <Flex direction="row" justify="flex-start" align="center" gap={4}>
          <Button colorPalette="teal" onClick={handleCreateCode}>
            Generate
          </Button>
          {showCode && (
            <>
              {showCode && (
                <ClipboardRoot value={code.join("")}>
                  <HStack>
                    <Text bgColor="gray.100" px={4} py={2} borderRadius={4}>{code}</Text>
                    <ClipboardIconButton size="md" />
                    <IconButton
                      aria-label="Clear code"
                      variant="subtle"
                      onClick={handleClearCode}
                    >
                      <LuX />
                    </IconButton>
                  </HStack>
                </ClipboardRoot>
              )}
            </>
          )}
        </Flex>
      </Field>
      <Flex
        direction="column"
        justify="flex-start"
        align="flex-start"
        w="full"
        gap={4}
      >
        <Heading>Existing Codes</Heading>
        {codes.length > 0 ? (
          <DataListRoot orientation="horizontal" divideY="1px">
            {codes.map((item, index) => (
              <ClipboardRoot key={item.VALUE} value={item.VALUE}>
                <HStack>
                  <Text bgColor="gray.100" px={4} py={2} borderRadius={4}>{item.VALUE}</Text>
                  <ClipboardIconButton size="md" />
                  <IconButton
                    aria-label="Delete code"
                    variant="subtle"
                    onClick={() => handleDeleteCode(item.VALUE)}
                  >
                    <LuX />
                  </IconButton>
                </HStack>
              </ClipboardRoot>
            ))}
          </DataListRoot>
        ) : (
          <Text>No existing codes</Text>
        )}
      </Flex>
    </Flex>
  );
}
