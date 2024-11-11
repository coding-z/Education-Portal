import { Flex } from "@chakra-ui/react";
import Menu from "./menu";

export default async function Page({
  params,
}: {
  params: Promise<{ unitCode: string }>;
}) {
  const unitCode = (await params).unitCode;

  return (
    <Flex direction="row" justify="flex-start" flexGrow={1} w="full">
      <Menu unitCode={unitCode} />
    </Flex>
  );
}
