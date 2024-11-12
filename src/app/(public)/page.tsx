import { Card, Center, Text } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center
      flexGrow={1}
      bgGradient="to-tl"
      gradientFrom={{ base: "gray.50", _dark: "gray.700" }}
      gradientVia={{ base: "teal.100", _dark: "teal.700" }}
      gradientTo={{ base: "gray.50", _dark: "gray.700" }}
    >
      <Card.Root
        variant="elevated"
        _dark={{ color: "white", bgColor: "gray.700" }}
      >
        <Card.Body>
          <Text w={{ base: "2xs", sm: "sm", lg: "lg" }}>
            Welcome to Education Portal! This is an online platform to support
            learning for both students and teachers. Sign up to gain access to
            features that can boost your learning!
          </Text>
        </Card.Body>
      </Card.Root>
    </Center>
  );
}
