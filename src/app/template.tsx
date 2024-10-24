import { Flex, Heading } from "@chakra-ui/react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Flex justify="center" bgColor="gray.50" shadow="sm" minH={14} align="center" w="full">
        <Heading color="teal.600">Education Portal</Heading>
      </Flex>
      {children}
    </>
  );
}
