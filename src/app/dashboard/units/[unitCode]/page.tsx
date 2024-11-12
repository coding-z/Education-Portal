"use client";

import BaseBanner from "@/app/base-banner";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/supabase/config";
import {
  FileUploadFileAcceptDetails,
  Flex,
  Heading,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FileObject } from "@supabase/storage-js";
import React, { useEffect, useState } from "react";
import { HiUpload } from "react-icons/hi";

export default function Page({
  params,
}: {
  params: Promise<{ unitCode: string }>;
}) {
  const [unitCode, setUnitCode] = useState("Loading Unit...");
  const [lessons, setLessons] = useState<FileObject[]>([]);
  const [url, setUrl] = useState(null);
  const [title, setTitle] = useState(null);
  const [showItem, setShowItem] = useState(false);

  function fetchFiles() {
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
            // console.log(data);
            setLessons(data);
          }
        });
    });
  }

  useEffect(fetchFiles, []);

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
      setShowItem(true);
    }
  }

  async function handleUpload(details: FileUploadFileAcceptDetails) {
    console.log("uploading", details.files[0]);
    const { data, error } = await supabase.storage
      .from("lessons")
      .upload(`${unitCode}/${details.files[0].name}`, details.files[0], {
        upsert: true,
      });
    
    if (error) {
      console.error(error);
      toaster.error({ title: "Failed to Upload File", duration: 5000 });
    } else {
      fetchFiles();
      console.log("success");
    }
  }

  return (
    <>
      <BaseBanner>
        <Heading ms={2}>{unitCode}</Heading>
        {showItem && (
          <Button
            variant="ghost"
            color="teal.600"
            onClick={() => setShowItem(false)}
          >
            Close
          </Button>
        )}
      </BaseBanner>
      <Flex direction="row" justify="flex-start" flexGrow={1} w="full">
        <Flex
          direction="column"
          bgColor="gray.50"
          borderRightWidth={1}
          borderColor="gray.300"
          w="2xs"
          justify="space-between"
          align="stretch"
          p={4}
          gap={4}
        >
          <VStack gap={0}>
            {lessons.length ? (
              lessons.map((lesson, index) => (
                <>
                  {/* {index > 0 && <Separator />} */}
                  <Button
                    key={lesson.name}
                    variant="ghost"
                    size="xs"
                    w="full"
                    onClick={() => handleDownload(lesson.name)}
                    color="teal.600"
                  >
                    <Flex direction="row" justify="flex-start" w="full">
                      {lesson.name}
                    </Flex>
                  </Button>
                </>
              ))
            ) : (
              <Text>Loading lessons...</Text>
            )}
          </VStack>
          <FileUploadRoot
            accept={["application/pdf"]}
            onFileAccept={handleUpload}
          >
            <FileUploadTrigger asChild>
              <Button alignSelf="stretch" color="teal.600" variant="outline">
                <HiUpload /> Upload File
              </Button>
            </FileUploadTrigger>
            {/* <FileUploadList /> */}
          </FileUploadRoot>
        </Flex>
        {showItem && (
          <iframe src={url} title={title} name={title} width="100%"></iframe>
        )}
      </Flex>
    </>
  );
}
