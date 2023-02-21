import type { NextPage } from "next";
import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const Signin: NextPage = () => {
  return (
    <Flex h="100vh" bgColor={"#0F172A"} justifyContent="center" pt={"28"}>
      <Box>
        <Center>
          <Text fontSize={"4xl"}>Log in to your account</Text>
        </Center>
        <Center>
          <Box
            mt={"20"}
            rounded={"2xl"}
            bgColor={"#1E293B"}
            h={"390px"}
            w={"738px"}
          >
            <Center pt={"17%"}>
              <Button
                bgColor={"#0F172A"}
                w={"523px"}
                h={"100px"}
                rounded={"25px"}
                fontSize={"30px"}
                onClick={() => {
                  void signIn("google");
                }}
              >
                Continue with Google{" "}
                <Center pl={"21px"}>
                  <FcGoogle fontSize={"50px"} />
                </Center>
              </Button>
            </Center>
          </Box>
        </Center>
      </Box>
    </Flex>
  );
};

export default Signin;

