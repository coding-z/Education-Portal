import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Flex, Heading } from "@chakra-ui/react";

const items = [
  { value: "lessons", title: "Lessons", content: "Lessons go here..." },
  {
    value: "whiteboards",
    title: "Whiteboards",
    content: "Whiteboards go here...",
  },
];

export default function Menu({ unitCode }: { unitCode: string }) {
  return (
    <Flex
      direction="column"
      bgColor="gray.50"
      borderRightWidth={1}
      borderColor="gray.300"
      w="2xs"
      justify="flex-start"
      align="center"
      p={4}
      gap={4}
    >
      <Flex direction="row" align="flex-start" w="full">
        <Heading>{unitCode}</Heading>
      </Flex>
      <AccordionRoot multiple collapsible defaultValue={["lessons"]}>
        {items.map((item, index) => (
          <AccordionItem key={index} value={item.value}>
            <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
            <AccordionItemContent>{item.content}</AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Flex>
  );
}
