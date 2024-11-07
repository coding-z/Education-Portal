import { Link as ChakraLink, Flex, HStack } from "@chakra-ui/react";
import NextLink from "next/link";

export default function DashboardHeader() {
  return (
    <Flex
      justify="center"
      bgColor="gray.50"
      shadow="md"
      minH={16}
      align="center"
      w="full"
      zIndex="docked"
    >
      <Flex
        flexGrow={1}
        justify="center"
        align="center"
        px={{ base: 2, md: 8, lg: 14 }}
        py={2}
      >
        <HStack gap={4}>
          <ChakraLink asChild colorPalette="teal" px={4} py={2}>
            <NextLink href="/dashboard/units">Units</NextLink>
          </ChakraLink>
          <ChakraLink asChild colorPalette="teal" px={4} py={2}>
            <NextLink href="/dashboard/codes">Codes</NextLink>
          </ChakraLink>
        </HStack>
      </Flex>
    </Flex>
  );
}
