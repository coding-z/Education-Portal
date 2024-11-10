import { Center, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center flexGrow={1} w="full">
      <Spinner size="xl" color="teal.600" />
    </Center>
  );
}
