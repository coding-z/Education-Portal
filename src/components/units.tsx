"use client";

import { Card, Flex, Heading, VStack } from "@chakra-ui/react";
import supabase from "../../supabase/config";
import { useState } from "react";

export default function Units() {
  const [units, setUnits] = useState([]);
  
  supabase
    .from("unit")
    .select()
    .then((value) => {
      setUnits(value.data);
    });

  return (
    <VStack w={["2xl", null, null, "5xl"]} align="flex-start" mt={8} gap={8}>
      <Heading size="3xl">Units</Heading>
      <Flex direction="row" justify="flex-start" wrap="wrap" gap={8}>
        {units.map((unit) => (
          <Card.Root
            key={unit.id}
            variant="elevated"
            colorPalette="teal"
            w="xs"
          >
            <Card.Body>
              <Card.Title>{unit.name}</Card.Title>
            </Card.Body>
          </Card.Root>
        ))}
      </Flex>
    </VStack>
  );
}
