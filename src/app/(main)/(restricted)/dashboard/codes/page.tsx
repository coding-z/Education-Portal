"use client";

import { Button } from "@/components/ui/button";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { Field } from "@/components/ui/field";
import { PinInput } from "@/components/ui/pin-input";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/supabase/config";
import { Tables } from "@/supabase/supabase";
import {
  Flex,
  Heading,
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
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codes, setCodes] = useState<Tables<"SIGNUP_CODE">[]>([]);

  function handleCodeChange(details: PinInputValueChangeDetails) {
    setCode(details.value.map((item) => item.toUpperCase()));
  }

  function handleClearCode() {
    setCode(["", "", "", "", "", ""]);
  }

  function handleCreateCode() {
    supabase
      .from("SIGNUP_CODE")
      .insert({ VALUE: code.join("") })
      .then(({ error }) => {
        if (error !== null) {
          console.error(error);
          toaster.error({
            title: "Failed to Create Code",
            duration: 5000,
          });
        } else {
          fetchCodes();
          handleClearCode();
          toaster.success({
            title: "Created Code",
            duration: 5000,
          });
        }
      });
  }

  function fetchCodes() {
    supabase
      .from("SIGNUP_CODE")
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
      .from("SIGNUP_CODE")
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
        <Heading>Teacher Signup Codes</Heading>
      </Flex>
      <Field
        label="Create Code"
        helperText="Enter a new alphanumeric signup code"
      >
        <Flex direction="row" justify="flex-start" align="center" gap={4}>
          <PinInput
            count={6}
            type="alphanumeric"
            value={code}
            pattern="[A-Za-z0-9]"
            onValueChange={handleCodeChange}
          />
          <IconButton
            aria-label="Clear code"
            variant="subtle"
            onClick={handleClearCode}
          >
            <LuX />
          </IconButton>
          <Button colorPalette="teal" onClick={handleCreateCode}>
            Create
          </Button>
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
              <Flex direction="row" pt={4} gap={8} key={item.VALUE}>
                <DataListItem label={`Code ${index + 1}`} value={item.VALUE} />
                <IconButton
                  aria-label="Delete code"
                  variant="ghost"
                  onClick={() => handleDeleteCode(item.VALUE)}
                  colorPalette="red"
                >
                  <LuX />
                </IconButton>
              </Flex>
            ))}
          </DataListRoot>
        ) : (
          <Text>No existing codes</Text>
        )}
      </Flex>
    </Flex>
  );
}
