"use client";

import { Card, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabase from "../../../../../supabase/config";
import { Tables } from "@/supabase/supabase";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<Tables<"UNIT">[]>([]);

  useEffect(() => {
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
  }, []);

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
        <Heading>Units</Heading>
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
