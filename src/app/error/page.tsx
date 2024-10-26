import { Center, HStack, Separator, Text } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center flexGrow={1} w="full">
      <HStack gap={4}>
        <Text fontSize="6xl">404</Text>
        <Separator orientation="vertical" height={14} size="md" />
        <Text fontSize="2xl" w="fit">
          This page could not be found.
        </Text>
      </HStack>
    </Center>
  );
}
