import { Flex } from "@chakra-ui/react";
import React from "react";

export default function BaseBanner({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      direction="row"
      justify="space-between"
      align="center"
      h={16}
      px={4}
      py={2}
      bgColor={{ base: "gray.50", _dark: "gray.700" }}
      borderBottomWidth={1}
      borderColor={{ base: "gray.300", _dark: "gray.950" }}
    >
      {children}
    </Flex>
  );
}
