"use client";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/supabase/config";
import { Flex, Heading } from "@chakra-ui/react";
import { FileObject } from "@supabase/storage-js";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ unitCode: string }>;
}) {
  const [unitCode, setUnitCode] = useState("Loading Unit...");
  const [lessons, setLessons] = useState<FileObject[]>([]);
  const [url, setUrl] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    params.then(({ unitCode: fetchedUnitCode }) => {
      setUnitCode(fetchedUnitCode);

      supabase.storage
        .from("lessons")
        .list(fetchedUnitCode, {
          sortBy: { column: "name", order: "asc" },
        })
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            toaster.error({ title: "Failed to Fetch Lessons", duration: 5000 });
          } else {
            console.log(data);
            setLessons(data);
          }
        });
    });
  }, []);

  async function handleDownload(name: string) {
    const { data, error } = await supabase.storage
      .from("lessons")
      .download(`${unitCode}/${name}`);

    if (error) {
      console.error(error);
      toaster.error({ title: "Failed to Download File", duration: 5000 });
    } else {
      setUrl(URL.createObjectURL(data));
      setTitle(name);
    }
  }

  return (
    <Flex direction="row" justify="flex-start" flexGrow={1} w="full">
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
          <AccordionItem value="lessons">
            <AccordionItemTrigger>Lessons</AccordionItemTrigger>
            <AccordionItemContent>
              {lessons.length
                ? lessons.map((lesson) => (
                    <Button key={lesson.name} variant="ghost" size="xs" w="full" onClick={() => handleDownload(lesson.name)} colorPalette="teal">
                      <Flex direction="row" justify="flex-start" w="full">
                        {lesson.name}
                      </Flex>
                    </Button>
                  ))
                : "Loading lessons..."}
            </AccordionItemContent>
          </AccordionItem>
          <AccordionItem value="whiteboards">
            <AccordionItemTrigger>Whiteboards</AccordionItemTrigger>
            <AccordionItemContent>Whiteboards go here...</AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </Flex>
      <iframe
        src={url}
        title={title}
        name={title}
        width="100%"
      ></iframe>
    </Flex>
  );
}
