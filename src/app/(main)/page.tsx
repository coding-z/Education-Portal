import { Card, Center, Flex, Text } from "@chakra-ui/react";

export default function Page() {
  return (
    <Flex flexGrow={1} w="full" bgGradient="to-tl" gradientFrom="gray.50" gradientTo="gray.50" gradientVia="teal.50">
      <Center flexGrow={1} w="full">
        <Card.Root variant="elevated">
          <Card.Body>
            <Text w={{ base: "2xs", sm: "sm", lg: "lg" }}>
              Welcome to Education Portal! This is an online platform to support
              learning for both students and teachers. Sign up to gain access to
              features that can boost your learning!
            </Text>
          </Card.Body>
        </Card.Root>
      </Center>
    </Flex>
  );
}
