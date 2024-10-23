import { Flex } from "@chakra-ui/react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Flex justify="center">
        <h1>Header</h1>
      </Flex>
      {children}
    </>
  );
}
