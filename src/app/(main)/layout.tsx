"use client";

import NavigationHeader from "@/components/navigation-header";
import { Flex } from "@chakra-ui/react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      direction="column"
      justify="flex-start"
      align="center"
      h="full"
      w="full"
      flexGrow={1}
    >
      <NavigationHeader />
      <Flex
        direction="column"
        justify="center"
        align="center"
        flexGrow={1}
        w="full"
      >
        {children}
      </Flex>
    </Flex>
  );
}
