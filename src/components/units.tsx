import { Card, Flex, Heading, VStack } from "@chakra-ui/react";

const units = [
  {
    code: "UNI1234",
    name: "Introduction to algorithms and data structures",
  },
  {
    code: "UNI5678",
    name: "Introduction to advanced database design",
  },
  {
    code: "NUP0101",
    name: "Foundations of electrical engineering",
  },
  {
    code: "YEP7878",
    name: "Research in geological science",
  },
  {
    code: "MAN4040",
    name: "Anatomy of human brains",
  },
];

export default function Units() {
  return (
    <VStack w={["2xl", null, null, "5xl"]} align="flex-start" mt={14} gap={8}>
      <Heading size="3xl">Units</Heading>
      <Flex direction="row" justify="flex-start" wrap="wrap" gap={8}>
        {units.map((unit) => (
          <Card.Root
            key={unit.code}
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
