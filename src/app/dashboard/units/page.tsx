"use client";

import { Card, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabase from "../../../supabase/config";
import { Tables } from "@/supabase/supabase";
import { Button } from "@/components/ui/button";
import CreateUnit from "./create-unit";
import { useRouter } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<Tables<"UNIT">[]>([]);
  const router = useRouter();
  const [user, setUser] = useState<Tables<"USER"> | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session === null) {
        setUser(null);
      } else {
        supabase.from("USER").select().eq("ID", session.user.id)
        .then(({ data, error }) => {
          if (error === null) {
            setUser(data[0]);
          }
        })
      }
    })
  }, []);

  function reload() {
    setLoading(true);
    supabase
      .from("UNIT")
      .select()
      .then(({ data, error }) => {
        setLoading(false);

        if (error) {
          console.error(error);
        } else {
          setUnits(data);
        }
      });
  }

  useEffect(reload, []);

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
      <Flex direction="row" justify="space-between" align="center" w="full">
        <Heading>Units</Heading>
        {user !== null && user.PRIVILEGE === "teacher" && (<CreateUnit reloadUnits={reload} />)}
      </Flex>
      <Flex
        direction="row"
        justify="flex-start"
        align="flex-start"
        alignItems="stretch"
        w="full"
        wrap="wrap"
        gap={4}
      >
        {loading ? (
          <Text>Loading units...</Text>
        ) : units.length ? (
          units.map((unit) => (
            <Card.Root
              key={unit.ID}
              variant="elevated"
              colorPalette="teal"
              w="sm"
              size="sm"
              _hover={{ cursor: "pointer", shadow: "xl" }}
              onClick={() => router.push(`/dashboard/units/${unit.CODE}`)}
            >
              <Card.Body gap={3}>
                <Card.Title>
                  {unit.CODE}
                  <br />
                  {unit.NAME}
                </Card.Title>
                <Card.Description>{unit.DESCRIPTION}</Card.Description>
              </Card.Body>
            </Card.Root>
          ))
        ) : (
          <Text>You aren't enroled in any units</Text>
        )}
      </Flex>
    </Flex>
  );
}
