import BaseBanner from "@/app/base-banner";
import logo from "@/app/icon.svg";
import Login from "@/components/login";
import { Link as ChakraLink, Heading, HStack } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BaseBanner>
        <ChakraLink asChild color="teal.600" p={2}>
          <NextLink href="/">
            <HStack>
              <Image src={logo} alt="Education portal logo" />
              <Heading>Education Portal</Heading>
            </HStack>
          </NextLink>
        </ChakraLink>
        <Login />
      </BaseBanner>
      {children}
    </>
  );
}
