import { Card, Center, Flex, Text } from "@chakra-ui/react";

export default function Page() {
  return (
    <Flex flexGrow={1} w="full" bgGradient="to-tl" gradientFrom={{ base: "gray.50", _dark: "gray.800" }} gradientTo={{ base: "gray.50", _dark: "gray.800" }} gradientVia={{ base: "teal.50", _dark: "teal.800" }}>
      <Center flexGrow={1} w="full">
        <Card.Root variant="elevated" _dark={{ bgColor: "gray.800" }}>
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
